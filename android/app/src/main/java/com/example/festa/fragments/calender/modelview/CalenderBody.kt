package com.example.festa.fragments.calender.modelview

import com.google.gson.annotations.SerializedName

class CalenderBody (
    @SerializedName("dates") var dates: String,
    @SerializedName("month") var month: String,
    @SerializedName("year") var year: String
)