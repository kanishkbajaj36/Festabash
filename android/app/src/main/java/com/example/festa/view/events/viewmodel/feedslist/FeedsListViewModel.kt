package com.example.festa.view.events.viewmodel.feedslist

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
class FeedsListViewModel @Inject constructor(
    application: Application,
    private val repository: FeedsListRepository
) :
    AndroidViewModel(application) {
    val progressIndicator = MutableLiveData<Boolean>()
    val errorResponse = MutableLiveData<Throwable>()
    val feedsListResponse = MutableLiveData<Event<FeedsListResponse>>()

    fun allFeedsList(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        eventId: String
    ) =
        viewModelScope.launch {
            allFeedList(progressDialog, activity, eventId)
        }

    private suspend fun allFeedList(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        eventId: String
    ) {
        progressDialog.start(activity.getString(R.string.please_wait))
        progressIndicator.value = true
        repository.allFeedList(eventId)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(object : DisposableObserver<FeedsListResponse>() {
                override fun onNext(value: FeedsListResponse) {
                    progressIndicator.value = false
                    progressDialog.stop()
                    feedsListResponse.value = Event(value)
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