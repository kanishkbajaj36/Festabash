package com.example.festa.view.invitedbyanyhost.viewmodel

import com.example.festa.services.ApiServices
import io.reactivex.Observable
import javax.inject.Inject

class InvitedByRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun getNotification(eventId:String): Observable<InvitedByResponse>
    {
        return apiService.invitedBFyPerson(eventId)
    }
}