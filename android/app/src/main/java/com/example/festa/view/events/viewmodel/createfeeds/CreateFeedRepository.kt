package com.example.festa.view.events.viewmodel.createfeeds

import com.example.festa.services.ApiServices
import com.example.festa.view.events.viewmodel.addimagealbum.AddImageInAlbumReponse
import io.reactivex.Observable
import okhttp3.MultipartBody
import okhttp3.RequestBody
import javax.inject.Inject

class CreateFeedRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun createFeeds(
        eventId: String,
        userId: String,
        description: RequestBody,
        images: MultipartBody.Part
    ): Observable<AddImageInAlbumReponse> {
        return apiService.createFeed(eventId,userId,description,images)
    }
}