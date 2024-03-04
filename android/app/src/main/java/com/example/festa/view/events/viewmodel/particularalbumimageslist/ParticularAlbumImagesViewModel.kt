package com.example.festa.view.events.viewmodel.particularalbumimageslist

import android.app.Activity
import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.festa.R
import com.example.festa.utils.Event
import com.johncodeos.customprogressdialogexample.CustomProgressDialog
import dagger.hilt.android.lifecycle.HiltViewModel
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.observers.DisposableObserver
import io.reactivex.schedulers.Schedulers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.launch
import javax.inject.Inject

@ExperimentalCoroutinesApi
@HiltViewModel
class ParticularAlbumImagesViewModel @Inject constructor(
    application: Application,
    private val repository: ParticularAlbumImagesRepository
) :
    AndroidViewModel(application) {
    val progressIndicator = MutableLiveData<Boolean>()
    val errorResponse = MutableLiveData<Throwable>()
    val particularAlbumImagesResponse = MutableLiveData<Event<ParticularAlbumImagesResponse>>()

    fun getParticularAlbumImages(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        eventId: String,
        album_ids: String
    ) =
        viewModelScope.launch {
            particularAlbumImages(progressDialog, activity,eventId,album_ids)
        }

    private suspend fun particularAlbumImages(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        eventId: String,
        album_ids: String
    ) {
        progressDialog.start(activity.getString(R.string.please_wait))
        progressIndicator.value = true
        repository.getParticularAlbumImages(eventId,album_ids)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(object : DisposableObserver<ParticularAlbumImagesResponse>() {
                override fun onNext(value: ParticularAlbumImagesResponse) {
                    progressIndicator.value = false
                    progressDialog.stop()
                    particularAlbumImagesResponse.value = Event(value)
                }

                override fun onError(e: Throwable) {
                    progressIndicator.value = false
                    progressDialog.stop()
                    errorResponse.value = e
                }

                override fun onComplete() {
                    progressDialog.stop()
                    progressIndicator.value = false
                }
            })
    }
}