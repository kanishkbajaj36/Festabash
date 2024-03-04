package com.example.festa.view.guest.viewmodel.guestlist

import com.example.festa.services.ApiServices
import io.reactivex.Observable
import javax.inject.Inject

class GuestListRepository@Inject constructor(private val apiService: ApiServices) {
    suspend fun getGuestList(eventId: String): Observable<GuestListResponse>
    {
        return apiService.getAllGuests(
            eventId)
    }
}