package com.example.festa.view.feedback.viewmodel

import com.example.festa.services.ApiServices
import io.reactivex.Observable
import javax.inject.Inject


class FeedbackRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun addFeedback(
        userId: String,
        commentOnFeedBody: FeedbackBody
    ): Observable<FeedbackResponse> {
        return apiService.feedbackSent(userId,commentOnFeedBody)
    }
}