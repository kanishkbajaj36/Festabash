package com.example.festa.view.events.ui

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.*
import android.widget.AdapterView
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.festa.R
import com.example.festa.application.Festa
import com.example.festa.databinding.FragmentEventListBinding
import com.example.festa.view.createevents.ui.CreateEventFragment
import com.example.festa.view.events.adapters.EventListAdapter
import com.example.festa.view.events.filterevent.FilterCityModelView
import com.example.festa.view.events.filterevent.FilterCityResponse
import com.example.festa.view.events.viewmodel.particularuserlist.ParticularUserEventListResponse
import com.example.festa.view.events.viewmodel.particularuserlist.ParticularUserEventListViewModel
import com.example.festa.view.notifications.notificationmodelview.NotificationModelView
import com.example.festa.view.notifications.ui.NotificationListActivity
import com.freqwency.promotr.utils.ErrorUtil
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.johncodeos.customprogressdialogexample.CustomProgressDialog
import dagger.hilt.android.AndroidEntryPoint
import java.util.*

@AndroidEntryPoint
class EventListFragment : Fragment() {
    private lateinit var activity: Activity
    private lateinit var binding: FragmentEventListBinding

    private val eventListViewModel: ParticularUserEventListViewModel by viewModels()
    private val notificationViewModel: NotificationModelView by viewModels()
    private val cityViewModel: FilterCityModelView by viewModels()
    private val progressDialog by lazy { CustomProgressDialog(requireActivity()) }
    private var eventListAdapter: EventListAdapter? = null
    private var dataList: List<ParticularUserEventListResponse.Event> = ArrayList()
    private var userId = ""
    private var eventIds = ""
    private var cityList: List<FilterCityResponse.CityName> = ArrayList()
    private var strCountryList = ArrayList<String>()
    private var strCityName = ""
    private var spinnerCity :Spinner? = null
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentEventListBinding.inflate(inflater, container, false)

        activity = requireActivity()
        userId = Festa.encryptedPrefs.UserId

        Log.e("userId", "onCreateView: $userId")

        binding.searchicon.setOnClickListener {
            binding.search.visibility = View.VISIBLE
            binding.festalogo.visibility = View.GONE
            binding.eventlist.visibility = View.GONE
            binding.eventicon.visibility = View.GONE
        }

        binding.close.setOnClickListener {
            binding.search.visibility = View.GONE
            binding.festalogo.visibility = View.VISIBLE
            binding.eventlist.visibility = View.VISIBLE
            binding.eventicon.visibility = View.VISIBLE
        }

        binding.filter.setOnClickListener {
            filterPopup()
        }

        binding.notificationsBtn.setOnClickListener {
            //img.setVisibility(View.VISIBLE)
            val intent = Intent(activity, NotificationListActivity::class.java)
            startActivity(intent)
        }

        binding.searchCountryName.setOnQueryTextListener(object :
            androidx.appcompat.widget.SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(p0: String?): Boolean {
                return false
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                filterList(newText)
                return true
            }
        })

        spinnerCity?.setOnItemSelectedListener(object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(adapterView: AdapterView<*>?, view: View, i: Int, l: Long) {
                val item: String = spinnerCity?.getSelectedItem().toString()
                if (item == "") {
                } else {
                    try {
                       // countryIds = spinnerCityResponseList.get(i).getId()
                        strCityName = cityList.get(i).city.toString()
                    } catch (e: java.lang.IndexOutOfBoundsException) {
                    }
                }
            }

            override fun onNothingSelected(adapterView: AdapterView<*>?) {}
        })






        eventListObserver()
        getEventList()
        getNotificationList()
        getFilterCityList()
        notificationListObserver()
        return binding.root
    }

    private fun filterList(query: String?) {
        if (query != null) {
            val filterList = ArrayList<ParticularUserEventListResponse.Event>()
            for (i in dataList) {
                if (i.title?.lowercase(Locale.ROOT)?.contains(query) == true) {
                    filterList.add(i)
                }
            }
            if (filterList.isEmpty()) {
                Toast.makeText(requireActivity(), "No Data found ", Toast.LENGTH_LONG).show()
            } else {
                eventListAdapter?.setFilteredList(filterList)
            }
        }
    }

    private fun filterPopup() {

        val bottomSheetDialog = BottomSheetDialog(requireActivity(), R.style.TopCircleDialogStyle)
        val view = LayoutInflater.from(context).inflate(R.layout.filter_event_list_popup, null)
        bottomSheetDialog.setContentView(view)

        val bottomSheetBehavior = BottomSheetBehavior.from((view.parent) as View)

        bottomSheetBehavior.state = BottomSheetBehavior.STATE_HALF_EXPANDED
         spinnerCity = bottomSheetDialog.findViewById<Spinner>(R.id.spinnerCity)!!
        view.setOnClickListener {
            if (bottomSheetBehavior.state == BottomSheetBehavior.STATE_HALF_EXPANDED) {
                bottomSheetBehavior.state = BottomSheetBehavior.STATE_EXPANDED
            } else {
                bottomSheetBehavior.state = BottomSheetBehavior.STATE_HALF_EXPANDED
            }
        }

        val applyBtn = bottomSheetDialog.findViewById<TextView>(R.id.applyBtn)!!


        applyBtn!!.setOnClickListener()
        {
            bottomSheetDialog.dismiss()

        }

        bottomSheetDialog.show()
        cityObserver()
    }


    private fun getEventList() {
        eventListViewModel.getEventList(progressDialog, activity, userId)
    }

    @SuppressLint("FragmentLiveDataObserve")
    private fun eventListObserver() {
        eventListViewModel.progressIndicator.observe(viewLifecycleOwner) {
        }
        eventListViewModel.mEventListResponse.observe(viewLifecycleOwner) {
            val message = it.peekContent().message
            val success = it.peekContent().success

            if (success == true) {
                dataList = it.peekContent().events!!
                binding.eventListRecycle.visibility = View.VISIBLE
                binding.eventListRecycle.layoutManager = LinearLayoutManager(context)
                eventListAdapter = EventListAdapter(
                    activity, requireActivity().supportFragmentManager,
                    dataList
                )
                binding.eventListRecycle.adapter = eventListAdapter
            } else {
                binding.notAnyEventAdded.visibility = View.VISIBLE
            }


        }

        eventListViewModel.errorResponse.observe(viewLifecycleOwner) {
            ErrorUtil.handlerGeneralError(requireActivity(), it)
            // errorDialogs()
        }
    }


    private fun getNotificationList() {
        notificationViewModel.getNotifications(progressDialog, activity, userId)
    }

    @SuppressLint("FragmentLiveDataObserve")
    private fun notificationListObserver() {
        notificationViewModel.progressIndicator.observe(this) {
        }
        notificationViewModel.mNotificationResponse.observe(this) {
            val count = it.peekContent().notificationCount


            if (count == null)
            {
                binding.notificationCount.text = "0"
                binding.notificationCount.setBackgroundResource(R.drawable.notification_count_background)
            }

            if (count != null) {
                binding.notificationCount.text = count.toString()
                binding.notificationCount.visibility = View.VISIBLE
            } else {
                binding.notificationCount.visibility = View.GONE


            }

        }

        notificationViewModel.errorResponse.observe(requireActivity()) {
            ErrorUtil.handlerGeneralError(requireContext(), it)
            // errorDialogs()
        }
    }

    override fun onResume() {
        super.onResume()
        binding.notificationCount.text = ""
        binding.notificationCount.visibility = View.GONE
    }


    private fun getFilterCityList() {
        cityViewModel.getCityBy(progressDialog, activity, userId)
    }

    @SuppressLint("FragmentLiveDataObserve")
    private fun cityObserver() {
        cityViewModel.progressIndicator.observe(this) {
        }
        cityViewModel.mInviteResponse.observe(this) {
            val count = it.peekContent().cityName

            strCountryList = ArrayList<String>()


            try {
                for (j in cityList.indices) {
                    strCityName = cityList.get(j).city.toString()
                    strCountryList.add(strCityName)
                }
            } catch (e: IndexOutOfBoundsException) {
                e.printStackTrace()
            }

            val dAdapter = CreateEventFragment.spinnerAdapter(
                requireActivity(),
                R.layout.custom_spinner_two,
                strCountryList
            )
            dAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            dAdapter.addAll(strCountryList)
            // dAdapter.add(getResources().getString(R.string.select_city));
            // dAdapter.add(getResources().getString(R.string.select_city));
            spinnerCity?.setAdapter(dAdapter)
            dAdapter.notifyDataSetChanged()
            if (strCityName == "") {
                val spinnerPosition: Int = dAdapter.getPosition("0")
                spinnerCity?.setSelection(spinnerPosition)
            }

        }

        cityViewModel.errorResponse.observe(requireActivity()) {
            ErrorUtil.handlerGeneralError(requireContext(), it)
            // errorDialogs()
        }
    }

}