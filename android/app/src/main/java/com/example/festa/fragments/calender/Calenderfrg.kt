package com.example.festa.fragments.calender

import android.annotation.SuppressLint
import android.app.Activity
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.festa.application.Festa
import com.example.festa.databinding.FragmentCalenderfrgBinding
import com.example.festa.fragments.calender.modelview.CalenderBody
import com.example.festa.fragments.calender.modelview.CalenderEventModelView
import com.example.festa.fragments.calender.modelview.CalenderResponse
import com.freqwency.promotr.utils.ErrorUtil
import com.johncodeos.customprogressdialogexample.CustomProgressDialog
import dagger.hilt.android.AndroidEntryPoint
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.ArrayList

@AndroidEntryPoint
class Calenderfrg : Fragment(), CalenderItemClick {
    private var _binding: FragmentCalenderfrgBinding? = null
    private val binding get() = _binding!!
    private lateinit var activity: Activity
    private var dataList: List<CalenderResponse.AllEvent> = ArrayList()
    private var dateColorList: List<CalenderResponse.EventDetail> = ArrayList()

    private val eventListViewModel: CalenderEventModelView by viewModels()
    private val progressDialog by lazy { CustomProgressDialog(requireActivity()) }
    private var calenderListAdapter: CalenderAdapter? = null
    private var calendarAdapter: CalendarDateAdapter? = null

    private lateinit var loinBody: CalenderBody
    private var userId = ""
    private var eventDate = ""
    private var currentMonth: Int = Calendar.getInstance().get(Calendar.MONTH) // Initial month
    private var currentYear: Int = Calendar.getInstance().get(Calendar.YEAR)
    private var year = ""
    private var monthAbbreviation = ""
    private var selectedDate = ""
    private var strDate = ""
    private var strCount = ""

    @SuppressLint("MissingInflatedId")
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate the layout for this fragment
        _binding = FragmentCalenderfrgBinding.inflate(inflater, container, false)
        val view = binding.root

        activity = requireActivity()

        userId = Festa.encryptedPrefs.UserId
        Log.e("EventListsdgf", "userId $userId")

        val months = arrayOf(
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        )
        val adapter = ArrayAdapter(requireActivity(), android.R.layout.simple_spinner_item, months)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)

        // Set initial month and year display to the current month and year
        updateMonthYearDisplay()

        // Replace this with your logic to get dates for the selected month
        val dateList = getDatesForSelectedMonth()

        val mutableDateList: MutableList<MutableList<String>> = dateList.map { it.toMutableList() }.toMutableList()

        calendarAdapter = CalendarDateAdapter(requireActivity(), mutableDateList, this, dateColorList)
        binding.calendarGridView.adapter = calendarAdapter

        // Add click listeners for the navigation arrows
        binding.backArrow.setOnClickListener {
            navigateToPreviousMonth()
        }

        binding.forwardArrow.setOnClickListener {
            navigateToNextMonth()
        }
        eventListObserver()

        return view
    }


    private fun navigateToPreviousMonth() {
        currentMonth--
        if (currentMonth < Calendar.JANUARY) {
            currentMonth = Calendar.DECEMBER
            currentYear--
        }

        updateMonthYearDisplay()

        val dateList = getDatesForSelectedMonth()
        Log.d("DebugASD", "Dates: $dateList")
       /* calendarAdapter = CalendarDateAdapter(requireActivity(), dateList, this, dateColorList)
        binding.calendarGridView.adapter = calendarAdapter*/
        calendarAdapter?.updateDates(dateList)
    }


    private fun navigateToNextMonth() {
        currentMonth++
        if (currentMonth > Calendar.DECEMBER) {
            currentMonth = Calendar.JANUARY
            currentYear++
        }

        updateMonthYearDisplay()

        val dateList = getDatesForSelectedMonth()

        //Reset the GridView adapter with the updated dates
       /* calendarAdapter = CalendarDateAdapter(requireActivity(), dateList, this, dateColorList)
        binding.calendarGridView.adapter = calendarAdapter*/
        calendarAdapter?.updateDates(dateList)
        Log.d("DebugASD", "DatesNext: $dateList")
    }


    private fun getDatesForSelectedMonth(): List<List<String>> {
        val calendar = Calendar.getInstance()
        calendar.set(Calendar.MONTH, currentMonth)
        calendar.set(Calendar.YEAR, currentYear)
        calendar.set(Calendar.DAY_OF_MONTH, 1) // Set to the first day of the month

        val datesGrid = mutableListOf<List<String>>()

        // Reset the calendar to the first day of the month
        calendar.set(Calendar.DAY_OF_MONTH, 1)

        // Find the index of the first day of the week (Sunday)
        val firstDayOfWeek = calendar.get(Calendar.DAY_OF_WEEK)

        // Adjust the calendar to start with the first day of the week
        calendar.add(Calendar.DAY_OF_MONTH, Calendar.SUNDAY - firstDayOfWeek)

        // Add the day names to the first row
        val dayNames = mutableListOf<String>()
        for (i in Calendar.SUNDAY..Calendar.SATURDAY) {
            dayNames.add(SimpleDateFormat("E", Locale.getDefault()).format(calendar.time))
            calendar.add(Calendar.DAY_OF_MONTH, 1)
        }
        datesGrid.add(dayNames)

        // Reset the calendar to the first day of the month
        calendar.set(Calendar.DAY_OF_MONTH, 1)

        // Add the dates for the selected month
        val datesInMonth = mutableListOf<String>()

        // Add empty strings for the days before the first day of the month
        repeat(firstDayOfWeek - Calendar.SUNDAY) {
            datesInMonth.add("")
        }

        for (i in 1..calendar.getActualMaximum(Calendar.DAY_OF_MONTH)) {
            val formattedDate = formatDate(i, currentMonth, currentYear)
            datesInMonth.add(formattedDate)
            calendar.add(Calendar.DAY_OF_MONTH, 1)
        }
        datesGrid.add(datesInMonth)

        return datesGrid
    }

    @SuppressLint("SetTextI18n")
    private fun updateMonthYearDisplay() {
        val calendar = Calendar.getInstance()
        calendar.set(Calendar.MONTH, currentMonth) // Adjust for zero-based months
        calendar.set(Calendar.YEAR, currentYear)

        // Format the month in full name (e.g., January, February, etc.)
        val monthAbbreviationFormat = SimpleDateFormat("MMM", Locale.getDefault())
        monthAbbreviation = monthAbbreviationFormat.format(calendar.time)

        // Get the year as a string
        year = currentYear.toString()
        getEventList(monthAbbreviation, year, selectedDate)

        // Update the UI with the formatted month and year
        binding.monthYearDisplay.text = "$monthAbbreviation $year"
    }

    override fun onItemDateClick(date: String) {
        selectedDate = date
        getEventList(monthAbbreviation, year, selectedDate)
        Log.e("CalendarDateAdaptersASD", "selectedDate.....$selectedDate")
    }


    private fun getEventList(month: String, years: String, selectedDate: String) {
        loinBody = CalenderBody(
            dates = selectedDate,
            month = month,
            year = years)

        eventListViewModel.calenderEvent(progressDialog, activity, userId, loinBody)
    }

    @SuppressLint("FragmentLiveDataObserve")
    private fun eventListObserver() {
        eventListViewModel.progressIndicator.observe(viewLifecycleOwner) {
        }
        eventListViewModel.mDeleteResponse.observe(viewLifecycleOwner) {

            dataList = it.peekContent().allEvents!!
            dateColorList = it.peekContent().eventDetails!!

            // Festa.encryptedPrefs.EventId = eventIds
            Log.e("DataAll", "dataList...Observer " + dataList.size)
            // Update the adapter with new data
            calendarAdapter?.updateDateColorList(dateColorList)

            binding.calendereventrecycle.isVerticalScrollBarEnabled = true
            binding.calendereventrecycle.isVerticalFadingEdgeEnabled = true
            binding.calendereventrecycle.layoutManager =
                LinearLayoutManager(requireActivity(), LinearLayoutManager.VERTICAL, false)
            calenderListAdapter =
                CalenderAdapter(
                    activity, requireActivity().supportFragmentManager,
                    dataList
                )
            binding.calendereventrecycle.adapter = calenderListAdapter
            calendarAdapter?.notifyDataSetChanged()
            eventListViewModel.errorResponse.observe(viewLifecycleOwner) {
                ErrorUtil.handlerGeneralError(requireActivity(), it)
                // errorDialogs()
            }
        }
    }

    private fun formatDate(day: Int, month: Int, year: Int): String {
        val calendar = Calendar.getInstance()
        calendar.set(year, month, day)
        val dateFormat = SimpleDateFormat("d MMM, yyyy", Locale.getDefault())
        return dateFormat.format(calendar.time)
    }
}