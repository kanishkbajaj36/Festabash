package com.example.festa.view.events.viewmodel.feedslikedislike

import com.example.festa.services.ApiServices
import io.reactivex.Observable
import javax.inject.Inject

class FeedLikeDislikeRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun getFeedLikeDislike(feedIds: String, userId: String): Observable<FeedLikeDislikeReponse> {
        return apiService.feedLikeDislike(feedIds,userId)
    }
}