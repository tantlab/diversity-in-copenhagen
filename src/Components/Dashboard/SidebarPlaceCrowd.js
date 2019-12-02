import React, { Component } from 'react'

import BarChartMulti from './Charts/BarChartMulti'
import strings from '../../_localization.js'

export default class SidebarPlaceCrowd extends Component {

    // total crowd
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

    render() {

        let data =
            this.props.data ? this.props.data : ''

        let venue =
            data.venue.lastSelected !== null
                ? data.venue.lastSelected
                : ''

        let totalPercents = [
            venue["Total Red"], venue["Total Yellow"], venue["Total Blue"], venue["Total crowd"]
        ]

        let percents = [
            venue["Red percent"], venue["Yellow percent"], venue["Blue percent"]
        ]

        return (
            <div className="sidebar-section crowd-info">

                <div className="sidebar-section">
                    <div className="sidebar-label">{strings.map.sidebar.venue.graphs.overall}</div>
                    <BarChartMulti data={this.eventPercentages(totalPercents)} />
                </div>
                <div className="sidebar-section">
                    <div className="sidebar-label">{strings.map.sidebar.venue.graphs.political}</div>
                    <BarChartMulti data={percents} />
                </div>

            </div>
        )
    }
}
