package com.example.festa.view.feedback.viewmodel

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
class FeedbackModelView @Inject constructor(
    application: Application, private val repository: FeedbackRepository
) :
    AndroidViewModel(application) {
    val progressIndicator = MutableLiveData<Boolean>()
    val errorResponse = MutableLiveData<Throwable>()
    val commentOnFeedResponse = MutableLiveData<Event<FeedbackResponse>>()

    fun addFeedback(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        userId: String,
        commentOnFeedBody: FeedbackBody
    ) =
        viewModelScope.launch {
            getFeedback(progressDialog, activity, userId, commentOnFeedBody)
        }

    private suspend fun getFeedback(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        userId: String,
        commentOnFeedBody: FeedbackBody
    ) {
        progressDialog.start(activity.getString(R.string.please_wait))
        progressIndicator.value = true
        repository.addFeedback(userId, commentOnFeedBody)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(object : DisposableObserver<FeedbackResponse>() {
                override fun onNext(value: FeedbackResponse) {
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