package com.example.festa.view.events.viewmodel.feedslist

import com.example.festa.services.ApiServices
import io.reactivex.Observable
import javax.inject.Inject

class FeedsListRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun allFeedList(
        eventId: String): Observable<FeedsListResponse> {
        return apiService.allFeedsList(eventId)
    }
}