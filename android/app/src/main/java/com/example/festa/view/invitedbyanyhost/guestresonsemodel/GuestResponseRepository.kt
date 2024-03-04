package com.example.festa.view.invitedbyanyhost.guestresonsemodel

import com.example.festa.services.ApiServices
import io.reactivex.Observable
import javax.inject.Inject

class GuestResponseRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun getGuestInvite(
        invitedEventId: String,
        guestInvite: GuestInviteResponseBody
    ): Observable<GuestInviteResponse> {
        return apiService.guestResponse(invitedEventId, guestInvite)
    }
}