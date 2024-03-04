package com.example.festa.view.createevents.viewmodel.createmutiple

import android.app.Activity
import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.festa.R
import com.example.festa.utils.Event
import com.example.festa.view.createevents.viewmodel.sendinvite.SendInviteResponse
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
class CreateMultiEventModel @Inject constructor(
    application: Application,
    private val customerRepository: CreateMultiEventRepository
) : AndroidViewModel(application) {

    val progressIndicator = MutableLiveData<Boolean>()
    val errorResponse = MutableLiveData<Throwable>()
    val mcreateEventResponse = MutableLiveData<Event<SendInviteResponse>>()

    fun getCreateEvent(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        eventId: String,
        title: RequestBody,
        description: RequestBody,
        event_Type: RequestBody,
        venue_Date_and_time: RequestBody,
        event_key: RequestBody,
        identify_document: Array<MultipartBody.Part?>,
        cityName: RequestBody,
    ) =
        viewModelScope.launch {
            userCreateEvent(
                progressDialog,
                activity,
                eventId,
                title,
                description,
                event_Type,
                venue_Date_and_time,
                event_key,
                identify_document,
                cityName
            )
        }

    private suspend fun userCreateEvent(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        eventId: String,
        title: RequestBody,
        description: RequestBody,
        event_Type: RequestBody,
        venue_Name: RequestBody,
        event_key: RequestBody,
        identify_document: Array<MultipartBody.Part?>,
        cityName: RequestBody
    ) {
        progressDialog.start(activity.getString(R.string.please_wait))
        progressIndicator.value = true
        customerRepository.getCreateMultiEvent(
            eventId,
            title,
            description,
            event_Type,
            venue_Name,
            event_key,
            identify_document,
            cityName
        )
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(object : DisposableObserver<SendInviteResponse>() {
                override fun onNext(value: SendInviteResponse) {
                    progressIndicator.value = false
                    progressDialog.stop()
                    mcreateEventResponse.value = Event(value)
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