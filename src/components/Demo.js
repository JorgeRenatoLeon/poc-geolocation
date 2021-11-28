import React from "react";
import { geolocated, geoPropTypes } from "react-geolocated";
import axios from "axios"

const apiGoogleUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng="
const apiGoogleKey = "&key=AIzaSyBq6WUFN2t5cnB_ewYLyJJSMJeSRBtw620"

const getDirection = (degrees, isLongitude) =>
    degrees > 0 ? (isLongitude ? "E" : "N") : isLongitude ? "W" : "S";

// adapted from http://stackoverflow.com/a/5786281/2546338
const formatDegrees = (degrees, isLongitude) =>
    `${0 | degrees}° ${
        0 | (((degrees < 0 ? (degrees = -degrees) : degrees) % 1) * 60)
    }' ${0 | (((degrees * 60) % 1) * 60)}" ${getDirection(
        degrees,
        isLongitude,
    )}`;

const Demo = (props) => {

    const [provincia, setProvincia] = React.useState("Empty")
    const [departamento, setDepartamento] = React.useState("Empty")
    const [distrito, setDistrito] = React.useState("Empty")
    const getResultsFiltered = (results) =>{
        const resultFiltered=[];
        results.forEach(element => {
           const components = element.address_components;
           let distritos = components.filter((component => component.types.includes("locality")));
           let distritoSelected = distritos.length > 0 ? distritos[0] : components.filter((component => component.types.includes("sublocality"))).length>0 ? components.filter((component => component.types.includes("sublocality")))[0] : {};
           if (distritoSelected.long_name !== "Cercado de Lima" && distritoSelected.long_name !== "Lima" )
            resultFiltered.push(element);
        });
        return resultFiltered.length > 0 ? resultFiltered[0]:results[0];

    }
    React.useEffect(()=>{
    
        if(props.isGeolocationAvailable && props.isGeolocationEnabled && props.coords){
            axios.get(
                apiGoogleUrl + props.coords.latitude + "," + props.coords.longitude + apiGoogleKey
            )
            .then( response => {
                //filter when the result is cercado de Lima
                let result = getResultsFiltered(response.data.results);                
                console.log(result);
                let components = result.address_components;
                setDepartamento(components.filter((component => component.types.includes("administrative_area_level_1")))[0])
                setProvincia(components.filter((component => component.types.includes("administrative_area_level_2")))[0])
                
                let distritos = components.filter((component => component.types.includes("locality")))

                setDistrito( distritos.length > 0 ? distritos[0] : components.filter((component => component.types.includes("sublocality"))).length>0 ? components.filter((component => component.types.includes("sublocality")))[0] : {})
            })
            .catch(e => {
                console.warn(e)
            })
        }

    }, [props])
    
    return (
        <div
            style={{
                fontSize: "large",
                fontWeight: "bold",
                margin: "2rem",
            }}
        >
            {!props.isGeolocationAvailable ? (
                <div>Your browser does not support Geolocation.</div>
            ) : !props.isGeolocationEnabled ? (
                <div>Geolocation is not enabled.</div>
            ) : props.coords ? (
                <div>
                    <div>
                        You are at{" "}
                        <span className="coordinate">
                            {formatDegrees(props.coords.latitude, false)}
                        </span>
                        ,{" "}
                        <span className="coordinate">
                            {formatDegrees(props.coords.longitude, true)}
                        </span>
                        {props.coords.altitude ? (
                            <span>
                                , approximately {props.coords.altitude} meters above sea
                                level
                            </span>
                        ) : null}
                        .
                    </div>
                    <div>
                        Departamento:{" "}
                        <span className="departamento">
                            {departamento.long_name}
                        </span>
                        <br/>
                        Provincia:{" "}
                        <span className="provincia">
                            {provincia.long_name}
                        </span>
                        <br/>
                        Distrito:{" "}
                        <span className="distrito">
                            {distrito.long_name}
                        </span>
                        <br/>
                    </div>
                </div>
            ) : (
                <div>Getting the location data&hellip;</div>
            )}
            {!!props.positionError && (
                <div>
                    <br />
                    Last position error:
                    <pre>{JSON.stringify(props.positionError)}</pre>
                </div>
            )}
        </div>
    )
};

Demo.propTypes = { ...Demo.propTypes, ...geoPropTypes };

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(Demo);