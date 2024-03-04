package com.example.festa.view.events.viewmodel.createfeeds

import android.app.Activity
import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.festa.R
import com.example.festa.utils.Event
import com.example.festa.view.events.viewmodel.addimagealbum.AddImageInAlbumReponse
import com.johncodeos.customprogressdialogexample.CustomProgressDialog
import dagger.hilt.android.lifecycle.HiltViewModel
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.observers.DisposableObserver
import io.reactivex.schedulers.Schedulers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.launch
import okhttp3.MultipartBody
import okhttp3.RequestBody
import javax.inject.Inject

@ExperimentalCoroutinesApi
@HiltViewModel
class CreateFeedViewModel @Inject constructor(
    application: Application,
    private val repository: CreateFeedRepository
) :
    AndroidViewModel(application) {
    val progressIndicator = MutableLiveData<Boolean>()
    val errorResponse = MutableLiveData<Throwable>()
    val createFeedResponse = MutableLiveData<Event<AddImageInAlbumReponse>>()

    fun createFeeds(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        eventId: String,
        userId: String,
        images: MultipartBody.Part,
        descriptions: RequestBody
    ) =
        viewModelScope.launch {
            createFeed(progressDialog, activity,eventId,userId,images,descriptions)
        }

    private suspend fun createFeed(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        eventId: String,
        userId: String,
        images: MultipartBody.Part,
        descriptions: RequestBody
    ) {
        progressDialog.start(activity.getString(R.string.please_wait))
        progressIndicator.value = true
        repository.createFeeds(eventId,userId,descriptions,images)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(object : DisposableObserver<AddImageInAlbumReponse>() {
                override fun onNext(value: AddImageInAlbumReponse) {
                    progressIndicator.value = false
                    progressDialog.stop()
                    createFeedResponse.value = Event(value)
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