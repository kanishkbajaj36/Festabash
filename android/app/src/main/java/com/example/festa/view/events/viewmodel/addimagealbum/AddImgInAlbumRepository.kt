package com.example.festa.view.events.viewmodel.addimagealbum

import com.example.festa.services.ApiServices
import io.reactivex.Observable
import okhttp3.MultipartBody
import javax.inject.Inject

class AddImgInAlbumRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun getAddImageInAlbum(images: MultipartBody.Part, album_ids: String): Observable<AddImageInAlbumReponse> {
        return apiService.addImgInAlbum(album_ids,images)
    }
}