package com.example.festa.fragments.bookmarktabFgmt.bookmarkmodelview

import com.example.festa.services.ApiServices
import io.reactivex.Observable
import javax.inject.Inject

class AllBookMarkRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun getFilterCity(userId: String): Observable<AllBookmarkResponse> {
        return apiService.allBookmark(userId)
    }
}