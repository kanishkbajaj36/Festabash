package com.example.festa.view.events.filterevent

import com.example.festa.services.ApiServices
import com.example.festa.view.invitedbyanyhost.viewmodel.InvitedByResponse
import io.reactivex.Observable
import javax.inject.Inject

class FilterCityRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun getFilterCity(userId: String): Observable<FilterCityResponse> {
        return apiService.filterCity(userId)
    }
}