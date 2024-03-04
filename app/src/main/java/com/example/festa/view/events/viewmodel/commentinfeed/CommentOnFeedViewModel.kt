package com.example.festa.view.events.viewmodel.commentinfeed

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
import javax.inject.Inject

@ExperimentalCoroutinesApi
@HiltViewModel
class CommentOnFeedViewModel @Inject constructor(
    application: Application,
    private val repository: CommentOnFeedRepository
) :
    AndroidViewModel(application) {
    val progressIndicator = MutableLiveData<Boolean>()
    val errorResponse = MutableLiveData<Throwable>()
    val commentOnFeedResponse = MutableLiveData<Event<AddImageInAlbumReponse>>()

    fun addCommentOnFeeds(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        feedIds: String,
        userId: String,
        commentOnFeedBody: CommentOnFeedBody
    ) =
        viewModelScope.launch {
            addCommentOnFeed(progressDialog, activity,feedIds,userId,commentOnFeedBody)
        }

    private suspend fun addCommentOnFeed(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        feedIds: String,
        userId: String,
        commentOnFeedBody: CommentOnFeedBody
    ) {
        progressDialog.start(activity.getString(R.string.please_wait))
        progressIndicator.value = true
        repository.addCommentOnFeeds(feedIds,userId,commentOnFeedBody)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(object : DisposableObserver<AddImageInAlbumReponse>() {
                override fun onNext(value: AddImageInAlbumReponse) {
                    progressIndicator.value = false
                    progressDialog.stop()
                    commentOnFeedResponse.value = Event(value)
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