import React, { Component } from 'react'
import { ResponsiveWaffle } from '@nivo/waffle'

import SliderChart from './Charts/SliderChart'

const colors = {
    r: "#f06666",
    y: "#f7cc5f",
    b: "#1d62ed",
    d: "#39b87f",
    n: "#ece9e9"
}

export default class SidebarEventInfo extends Component {

    trimString(str, length = 24) {
        if (str) {
            return str.length > length ? str.slice(0, length) + "..." : str
        } else return
    }

    eventPercentages(array) {
        if (array.length > 0) {
            let tot = 0
            array.forEach(element => {
                tot += element
            })
            const percs = array.map(el => {
                return el / tot * 100
            })
            return percs
        } else return [0, 0, 0]
    }

    headerColor(string) {
        switch (string) {
            case "RED":
                return colors.r
            case "YELLOW":
                return colors.y
            case "BLUE":
                return colors.b
            case "DIVERSE":
                return colors.d
            case "GRAY":
                return colors.n
            default:
                break
        }
    }

    render() {

        let data =
            (this.props.data ? this.props.data : '')

        let venue =
            (data.venue.lastSelected !== null
                ? data.venue.lastSelected
                : '')

        let least = "Least Diverse Event"
        let most = "Most diverse event"

        // let r_most = "no Red_most"
        // let y_most = "no Yellow_most"
        // let b_most = "no Blue_most"
        // let no_most = [venue[r_most], venue[y_most], venue[b_most]]

        // let r_least = "no Red_least"
        // let y_least = "no Yellow_least"
        // let b_least = "no Blue_least"
        // let no_least = [venue[r_least], venue[y_least], venue[b_least]]

        let waffleTotal = venue["Number of Events"]
        let waffleData = [
            { id: "Red events", value: venue["Red events"], label: "Red events", color: colors.r },
            { id: "Yellow events", value: venue["Yellow events"], label: "Yellow events", color: colors.y },
            { id: "Blue events", value: venue["Blue events"], label: "Blue events", color: colors.b },
            { id: "Diverse events", value: venue["Diverse events"], label: "Diverse events", color: colors.d },
            { id: "Gray events", value: venue["Gray events"], label: "Gray events", color: colors.n },
        ]

        // console.log(venue);

        return (

            <div className="sidebar-section place-info">

                <div className="sidebar-place-name"
                    style={{ color: this.headerColor(venue["Place Type"]) }}>
                    {this.trimString(venue["Place_Name"])}
                </div>

                <div className="event-data">
                    <div className="sidebar-event number-of">
                        <div className="sidebar-label">Number of Events</div>
                        <div className="sidebar-value numeric">{waffleTotal}</div>
                    </div>
                </div>

                <div className="sidebar-events">
                    <div className="sidebar-event">
                        <div className="sidebar-label">Least Diverse Event</div>
                        <div className="sidebar-value text">{this.trimString(venue[least], 32)}</div>
                    </div>
                    <div className="sidebar-event">
                        <div className="sidebar-label">Most Diverse Event</div>
                        <div className="sidebar-value text">{this.trimString(venue[most], 32)}</div>
                    </div>
                </div>

                <div className="sidebar-poldiv">
                    <div className="sidebar-section">
                        <div className="sidebar-label">Political Charge</div>
                        <SliderChart data={venue["Political Charge"]} />
                    </div>
                    <div className="sidebar-section">
                        <div className="sidebar-label">Diversity Score</div>
                        <SliderChart data={venue["DIV SCORE PLACE"]} />
                    </div>
                </div>

                <div className="sidebar-section">
                    <div className="sidebar-label">Types of Events</div>

                    {waffleData[0].value !== undefined && waffleTotal !== undefined ? (
                        <div className="nivo-container" style={{ height: "108px" }}>
                            <ResponsiveWaffle
                                data={waffleData}
                                total={waffleTotal}
                                rows={6}
                                columns={16}
                                padding={0.0}
                                fillDirection="right"
                                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                                colors={[colors.r, colors.y, colors.b, colors.d, colors.n]}
                                borderWidth={1}
                                borderColor={{ from: 'color', modifiers: [['brighter', 0.3]] }}
                                animate={true}
                                motionStiffness={100}
                                motionDamping={16}
                            />
                        </div>

                    ) : ""}
                </div>


            </div>
        )
    }
}
