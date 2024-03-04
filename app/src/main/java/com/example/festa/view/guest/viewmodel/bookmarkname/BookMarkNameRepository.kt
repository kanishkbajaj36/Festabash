package com.example.festa.view.guest.viewmodel.bookmarkname

import com.example.festa.services.ApiServices
import io.reactivex.Observable
import javax.inject.Inject

class BookMarkNameRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun getBookMarkList(collectionId: String): Observable<BookMarkNameResponse>
    {
        return apiService.getCollectionGuest(collectionId)
    }
}