package com.example.festa.view.events.viewmodel.allalbumshow

import com.example.festa.services.ApiServices
import io.reactivex.Observable
import javax.inject.Inject

class AllAlbumRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun getAllAlbumList(eventId: String): Observable<AllAlbumResponse> {
        return apiService.getAllAlbum(eventId)
    }
}