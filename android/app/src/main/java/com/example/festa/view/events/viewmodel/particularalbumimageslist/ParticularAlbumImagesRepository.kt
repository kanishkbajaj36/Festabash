package com.example.festa.view.events.viewmodel.particularalbumimageslist

import com.example.festa.services.ApiServices
import io.reactivex.Observable
import javax.inject.Inject

class ParticularAlbumImagesRepository @Inject constructor(private val apiService: ApiServices){
    suspend fun getParticularAlbumImages(eventId: String, album_ids: String): Observable<ParticularAlbumImagesResponse> {
        return apiService.ParticularAlbumImages(eventId,album_ids)
    }
}