import {
    Bar,
    ComposedChart,
    CartesianGrid,
    Legend,
    Line,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import distinctColors from 'distinct-colors';
import { FormatCurrency } from 'Utils/Strings';

import { Policy } from "Types/ClientResources";

// Multiplier constant for padding the Y axis
let PAD_FACTOR = 1.1;

let Graph = (props: {
    control: any,
    policies: Policy[],
    data: any,
    maxY: number,
    growth: number,
}) => {
    var palette = distinctColors({
        count: props.policies.length+2,
        lightMin: 50,
    });
    let palIx = 0;
    return (
        <ComposedChart
            width  = {800}
            height = {500}
            data   = {props.data}
            margin = {{ left: 40 }}
        >
            <CartesianGrid strokeDasharray="3 3" />

            {props.policies.map((policy: Policy) => (
                <Bar
                    key     = {policy.Id}
                    dataKey = {policy.ExternalId}
                    name    = {'Policy ' + policy.ExternalId}
                    stackId = "a"
                    fill    = {palette[palIx++].hex()}
                />
            ))}

            <Line
                type        = "monotone"
                dataKey     = "total"
                stroke      = 'green'
                name        = 'Total portfolio'
                strokeWidth = {2}
                dot         = {false}
            />
            <Line
                type        = "monotone"
                dataKey     = "cash"
                stroke      = 'red'
                name        = 'Cash'
                strokeWidth = {2}
                dot         = {false}
            />

            <XAxis
                dataKey="year"
                // label={{ value: 'Year', position: 'insideBottom' }}
            />
            <YAxis
                domain = {[
                    0,
                    (dataMax: any) => PAD_FACTOR * Math.max(dataMax, props.maxY)
                ]}
                tickFormatter={(x: any) => FormatCurrency(x * 100)}
            />
            <Tooltip 
                labelFormatter = {(x: any) => <b>Year {x}:</b>}
                formatter      = {(x: any) => FormatCurrency(x * 100)}
            />

            <Legend verticalAlign="top" />
        </ComposedChart>
    );
};

export default Graph;
