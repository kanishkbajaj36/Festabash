package com.example.festa.view.events.viewmodel.deletefeeds

import com.example.festa.services.ApiServices
import com.example.festa.view.events.viewmodel.addimagealbum.AddImageInAlbumReponse
import io.reactivex.Observable
import javax.inject.Inject

class DeleteFeedRepository @Inject constructor(private val apiService: ApiServices){
    suspend fun getDeleteFeed(feedIds: String, userId: String): Observable<AddImageInAlbumReponse> {
        return apiService.deleteFeed(userId,feedIds)
    }
}