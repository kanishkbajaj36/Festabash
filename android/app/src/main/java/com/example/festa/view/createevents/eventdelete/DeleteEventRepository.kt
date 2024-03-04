package com.example.festa.view.createevents.eventdelete

import com.example.festa.services.ApiServices
import com.example.festa.view.guest.viewmodel.bookmarkpost.BookMarkPostResponse
import io.reactivex.Observable
import javax.inject.Inject

class DeleteEventRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun getEventDelete(guestId:String): Observable<BookMarkPostResponse>
    {
        return apiService.deleteEvent(guestId)
    }
}