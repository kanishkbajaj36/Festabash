package com.example.festa.view.events.viewmodel.commentinfeed

import com.example.festa.services.ApiServices
import com.example.festa.view.events.viewmodel.addimagealbum.AddImageInAlbumReponse
import io.reactivex.Observable
import javax.inject.Inject

class CommentOnFeedRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun addCommentOnFeeds(
        feedIds: String,
        userId: String,
        commentOnFeedBody: CommentOnFeedBody
    ): Observable<AddImageInAlbumReponse> {
        return apiService.addCommentOnFeed(feedIds,userId,commentOnFeedBody)
    }
}