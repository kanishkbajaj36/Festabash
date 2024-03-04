package com.example.festa.fragments.calender.modelview

import com.example.festa.services.ApiServices
import io.reactivex.Observable
import javax.inject.Inject

class CalenderEventRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun getCalender(userId: String, calender: CalenderBody): Observable<CalenderResponse> {
        return apiService.calenderEventList(userId, calender)
    }
}