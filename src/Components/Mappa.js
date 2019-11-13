import React from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/src/css/mapbox-gl.css'

import './Mappa.css'
import MapNavigator from './Dashboard/MapNavigator'
import SidebarComponentBubbles from './Dashboard/SidebarComponentBubbles'
import VenueBar from './Dashboard/VenueBar'
import Modal from './Modal'

export default class Mappa extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            // lat: 55.6297,            // coordinates of 
            // lng: 12.5562,            // Copenhagen's center
            lat: 55.675,                // coordinates of 
            lng: 12.57,                 // Copenhagen's center
            zoom: 11,                   // initial zoom level
            factions: [],               // 
            venueFocus: false,          // no selected place on load
            showModal: false,           // modal is closed by default
            hoveredStateId: null        // controls the hover state on rodes layer
        }
    }

    openModal = () => {
        this.setState({ showModal: true })
    }
    closeModal = () => {
        this.setState({ showModal: false })
    }

    checkZoom = () => {
        if (this.state.zoom >= 12) {
            return true
        } else return false
    }

    getAvgValues = (data) => {
        if (data.length > 0) {
            let c = [[], [], []]
            let tot = []
            data.forEach(place => {
                c[0].push(place.properties['Red Percent']);
                c[1].push(place.properties['Yellow Percent']);
                c[2].push(place.properties['Blue Percent']);
                tot.push(place.properties['Total Political Crowd'])
            });

            let avgs = c.map((faction) => {
                let aggregates = 0
                let tots = 0
                tot.map((placeTot, t) => {
                    return [aggregates += (placeTot * faction[t]), tots += placeTot]
                })
                return aggregates / tots
            })
            return avgs
        }
        else return [0, 0, 0]
    }

    updateMapData = (map) => {
        // update average values of bubblechart
        if (this.checkZoom) {
            const viewportData = map.queryRenderedFeatures({ layers: ['venues'] })
            this.setState({ factions: this.getAvgValues(viewportData) })
        } else return false
    }


    handleMapEvents = (map) => {
        // first update of rendered layers
        // it renders the graphs' data the first time
        map.on('load', () => {
            this.updateMapData(map)
        })

        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom(),
            })
            // if we zoom out, close also place info box
            if (this.checkZoom() === false) {
                this.setState({ venueFocus: false })
            }
        })

        // TO-DO: write function to handle events on zoom levels
        map.on('moveend', () => {
            this.updateMapData(map)
        })
    }

    handleRodeEvents = (map) => {
        map.on('mousemove', 'rodes', (e) => {
            if (e.features.length > 0) {
                if (this.state.hoveredStateId) {
                    map.setFeatureState({
                        source: 'composite',
                        sourceLayer: 'Rode_layer_nov12-462huj',
                        id: this.state.hoveredStateId
                    }, { hover: false });
                }
                
                if (this.state.hoveredStateId !== e.features[0].id) {
                    console.log(e.features[0].id);
                }

                // setting hovered state id state
                this.setState({ hoveredStateId: e.features[0].id })

                map.setFeatureState({
                    source: 'composite',
                    sourceLayer: 'Rode_layer_nov12-462huj',
                    id: this.state.hoveredStateId
                }, { hover: true });
            }
        })

        map.on('mouseleave', 'rodes', () => {
            if (this.state.hoveredStateId) {
                map.setFeatureState({
                    source: 'composite',
                    sourceLayer: 'Rode_layer_nov12-462huj',
                    id: this.state.hoveredStateId
                }, { hover: false });
            }
            this.setState({ hoveredStateId: null })
        })
    }

    handleVenueEvents = (map) => {
        const popup = new mapboxgl.Popup({
            closeButton: false
        })

        map.on('mouseenter', 'venues', (e) => {
            map.getCanvas().style.cursor = 'pointer'
            const data = e.features[0]
            popup.setLngLat(data.geometry.coordinates.slice())
                .setHTML(data.properties["Place"])
                .addTo(map)
        })
        map.on('mouseleave', 'venues', (e) => {
            map.getCanvas().style.cursor = ''
            popup.remove()
        })
        // if click on the map (not on place points) we close the info box
        map.on('click', () => {
            this.setState({
                venueFocus: false
            })
        })
        // if click on the place points, we open the info box
        // and show info of the place
        map.on('click', 'venues', (e) => {
            let venueProps = e.features[0].properties
            this.setState({
                venueFocus: true,
                lastSelectedVenue: venueProps
            })
        })
    }



    componentDidMount() {

        mapboxgl.accessToken = 'pk.eyJ1IjoiZHJpdmlud2FyZCIsImEiOiJjazI1N2lkbm4xMHg2M25tcWQ1anprM3Y0In0.sxw7MdBqOuUsi3LDjHqhoA'

        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/drivinward/ck2rkn9853jak1co95id5hozb/draft',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom,
            minZoom: 11,
            maxBounds: [12.3, 55.55, 12.85, 55.8]
        })

        // let's make sure the default center is properly set
        map.setCenter([this.state.lng, this.state.lat]);

        this.handleMapEvents(map)
        this.handleRodeEvents(map)
        this.handleVenueEvents(map)

    }



    render() {
        let lat = this.state.lat.toString().split('.')
        let lng = this.state.lng.toString().split('.')
        let zoom = parseInt(this.state.zoom)
        let venueData = this.state.lastSelectedVenue ? this.state.lastSelectedVenue : ''
        let divScore = venueData["DIV SCORE PLACE"] ? parseInt(venueData["DIV SCORE PLACE"]) : 'n.a.'
        let placeEff = venueData["Place_effect"] ? parseFloat(venueData["Place_effect"]).toFixed(2) : 'n.a.'

        return (
            <div className="page">

                <Modal show={this.state.showModal} onCloseBtn={this.closeModal} />

                <div className="dashboard">
                    <div className="sidebar">

                        <VenueBar showVenue={this.state.venueFocus}>
                            <div className="text-field title"><a href={venueData["Maps Link"]} rel="noopener noreferrer" target="_blank">{venueData["Place"]} ↗</a></div>
                            <div className="venue-details data">
                                <div className="text-field value">
                                    <span>Diversity score</span>
                                    <span>{divScore}</span>
                                </div>
                                <div className="text-field value">
                                    <span>Place effect</span>
                                    <span>{placeEff}</span>
                                </div>
                            </div>
                            <div className="venue-details">
                                <div className="text-field">Least Diverse Event</div>
                                <div className="text-field">{venueData["Least Diverse Event"]}</div>
                                <div className="text-field">Most Diverse Event</div>
                                <div className="text-field">{venueData["Most Diverse Event"]}</div>
                            </div>
                        </VenueBar>

                        <SidebarComponentBubbles
                            title="Factions presence"
                            zoom={this.state.zoom}
                            factions={this.state.factions}
                        />

                    </div>
                </div>

                <MapNavigator lat={lat} lng={lng} zoom={zoom} onClick={this.openModal} />

                <div ref={el => this.mapContainer = el} className="mapContainer"></div>
            </div>
        )
    }

}