import { NextResponse } from 'next/server';
import { calendar } from '@/lib/google';
import ICAL from 'ical.js';
import fetch from 'node-fetch';

export async function GET() {
    // Dynamically find all CALENDAR_ID_* keys or URLS in process.env
    const calendarIds = Object.keys(process.env)
        .filter(key => key.startsWith('CALENDAR_ID'))
        .map(key => process.env[key])
        .filter(Boolean) as string[];

    const HOLIDAY_CALS = [
        'en.usa#holiday@group.v.calendar.google.com',
        'en.sa#holiday@group.v.calendar.google.com',
        'en.dutch#holiday@group.v.calendar.google.com'
    ];

    const uniqueIds = Array.from(new Set([...calendarIds, ...HOLIDAY_CALS]));

    try {
        const allEvents = [];
        const timeMin = new Date();
        timeMin.setHours(0, 0, 0, 0);

        const timeMax = new Date();
        timeMax.setDate(timeMax.getDate() + 7);
        timeMax.setHours(23, 59, 59, 999);

        for (const calendarId of uniqueIds) {
            try {
                // Determine if it's a URL (iCal/ICS) or a Google ID
                if (calendarId.startsWith('http')) {
                    console.log(`[Calendar API] Fetching ICS from: ${calendarId.substring(0, 50)}...`);
                    const response = await fetch(calendarId);

                    if (!response.ok) {
                        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
                    }

                    const icsData = await response.text();
                    console.log(`[Calendar API] Received ${icsData.length} characters. Start: ${icsData.substring(0, 100)}`);

                    const jcalData = ICAL.parse(icsData);
                    const vcalendar = new ICAL.Component(jcalData);
                    const vevents = vcalendar.getAllSubcomponents('vevent');

                    for (const vevent of vevents) {
                        const event = new ICAL.Event(vevent);
                        const start = event.startDate.toJSDate();
                        const end = event.endDate.toJSDate();

                        // Only include if in range
                        if (start >= timeMin && start <= timeMax) {
                            let finalCalendarId = '1'; // Default Work for ical
                            if (calendarId.toLowerCase().includes('2u.com')) {
                                finalCalendarId = '1';
                            }

                            allEvents.push({
                                id: event.uid,
                                title: event.summary,
                                start: start.toISOString(),
                                end: end.toISOString(),
                                location: event.location,
                                calendarId: finalCalendarId,
                                isAllDay: event.startDate.isDate,
                            });
                        }
                    }
                } else {
                    // Standard Google API Flow
                    const response = await calendar.events.list({
                        calendarId: calendarId,
                        timeMin: timeMin.toISOString(),
                        timeMax: timeMax.toISOString(),
                        maxResults: 100,
                        singleEvents: true,
                        orderBy: 'startTime',
                    });

                    if (response.data.items) {
                        allEvents.push(...response.data.items.map(event => {
                            const summary = (event.summary || '').toLowerCase();
                            const cid = (calendarId || '').toLowerCase();

                            // Categorize by account
                            let finalCalendarId = calendarId;
                            let holidayLabel = null;

                            if (cid.includes('2u.com')) {
                                finalCalendarId = '1'; // Work
                            } else if (cid.includes('monkeydobetter.com')) {
                                finalCalendarId = '2'; // Personal
                            } else if (cid.includes('holiday') || summary.includes('holiday')) {
                                finalCalendarId = '4'; // Holiday
                                if (cid.includes('usa')) holidayLabel = 'US Holiday';
                                else if (cid.includes('.sa')) holidayLabel = 'Cape Town Holiday';
                                else if (cid.includes('dutch') || cid.includes('.nl')) holidayLabel = 'Netherlands Holiday';
                            }

                            let finalTitle = event.summary || 'Private Meeting';
                            if (finalTitle === 'Busy') finalTitle = 'Occupied';

                            return {
                                id: event.id,
                                title: finalTitle,
                                start: event.start?.dateTime || event.start?.date,
                                end: event.end?.dateTime || event.end?.date,
                                location: event.location,
                                calendarId: finalCalendarId,
                                isAllDay: !event.start?.dateTime,
                                holidayLabel
                            };
                        }));
                    }
                }
            } catch (calError: any) {
                if (calError.message?.includes('Not Found')) {
                    console.warn(`[Calendar API] Not Found: ${calendarId}`);
                } else {
                    console.warn(`[Calendar API] Error for ${calendarId}:`, calError.message);
                }
            }
        }

        const sortedEvents = allEvents
            .filter(e => e.start && typeof e.start === 'string')
            .sort((a, b) => {
                const startA = a.start as string;
                const startB = b.start as string;
                return new Date(startA).getTime() - new Date(startB).getTime();
            });

        return NextResponse.json(sortedEvents);
    } catch (error: any) {
        console.error('Calendar API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
