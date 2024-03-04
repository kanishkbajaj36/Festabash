package com.example.festa.view.notifications.notificationmodelview

import com.example.festa.services.ApiServices
import io.reactivex.Observable
import javax.inject.Inject

class NotificationRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun getNotification(userId:String): Observable<NotificationResponse>
    {
        return apiService.notification(userId)
    }
}