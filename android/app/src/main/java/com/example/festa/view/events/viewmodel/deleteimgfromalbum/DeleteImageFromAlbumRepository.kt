package com.example.festa.view.events.viewmodel.deleteimgfromalbum

import com.example.festa.services.ApiServices
import com.example.festa.view.events.viewmodel.addimagealbum.AddImageInAlbumReponse
import io.reactivex.Observable
import javax.inject.Inject

class DeleteImageFromAlbumRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun getDeleteImgFromAlbum(image_Ids: String, album_id: String): Observable<AddImageInAlbumReponse> {
        return apiService.deleteImgFromAlbum(image_Ids,album_id)
    }
}