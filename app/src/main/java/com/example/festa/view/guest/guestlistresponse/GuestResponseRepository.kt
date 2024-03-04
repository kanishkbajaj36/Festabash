package com.example.festa.view.guest.guestlistresponse

import com.example.festa.services.ApiServices
import io.reactivex.Observable
import javax.inject.Inject

class GuestResponseRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun getGuestResponse(eventId:String,response: GuestResponseBody): Observable<GuestListUserResponse>
    {
        return apiService.getAllGuest_of_invitation(eventId,response)
    }
}