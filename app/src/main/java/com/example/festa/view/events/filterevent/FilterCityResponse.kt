package com.example.festa.view.events.filterevent

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import java.io.Serializable

class FilterCityResponse {
    @SerializedName("success")
    @Expose
    var success: Boolean? = null

    @SerializedName("message")
    @Expose
    var message: String? = null

    @SerializedName("city_Name")
    @Expose
    var cityName: List<CityName>? = null

    inner  class CityName : Serializable
    {

        @SerializedName("city")
        @Expose
        var city: String? = null

    }
}