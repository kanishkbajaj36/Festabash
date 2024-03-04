package com.example.festa.view.notifications.viewnotificationmodelview

import com.example.festa.services.ApiServices
import com.example.festa.view.guest.viewmodel.bookmarkpost.BookMarkPostResponse
import io.reactivex.Observable
import javax.inject.Inject

class NotificationViewRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun getViewNotification(userId:String): Observable<BookMarkPostResponse>
    {
        return apiService.changeNotification(userId)
    }
}