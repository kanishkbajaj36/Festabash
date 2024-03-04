package com.example.festa.view.events.viewmodel.commentlist

import com.example.festa.services.ApiServices
import io.reactivex.Observable
import javax.inject.Inject

class CommentListRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun allCommentLists(feedIds: String): Observable<CommentListResponse> {
        return apiService.allCommentList(feedIds)
    }
}