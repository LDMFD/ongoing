import Day from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/en-gb'
import parseISO from 'date-fns/parseISO';

Day.extend(utc);
Day.locale('en-gb')

// Moves the timezone to the local computer's (without changing the time of day) and returns a string in UK format
export const FromCanonical = (date) => {
    if (date == null || !date) {  // catch null and empty string
        return null;
    }
    
    // Expecting RFC3339 (GetClient.go)
    let t = new Date(parseISO(date));

    let adj = new Date(t.getTime() + t.getTimezoneOffset() * 60000);

    return adj.toLocaleDateString('en-GB')
}

// Moves the date back to UTC without changing the time
export const ToCanonical = (datetime) => {
    let r = Day(datetime).utc(true).format();
    if (r === 'Invalid Date') {
        return null;
    }
    return r;
}

export const CanonicalNow = () => (
    Day(Date.now()).utc(true).format()
);
