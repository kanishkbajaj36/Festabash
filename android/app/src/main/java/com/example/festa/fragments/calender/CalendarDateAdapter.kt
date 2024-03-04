package com.example.festa.fragments.calender

import android.content.Context
import android.graphics.Color
import android.os.Build
import android.text.Spannable
import android.text.SpannableString
import android.text.Spanned
import android.text.style.ForegroundColorSpan
import android.text.style.RelativeSizeSpan
import android.util.Log
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.TextView
import androidx.annotation.RequiresApi
import androidx.core.content.ContextCompat
import com.example.festa.R
import com.example.festa.fragments.calender.modelview.CalenderResponse
import java.text.ParseException
import java.text.SimpleDateFormat
import java.util.*

class CalendarDateAdapter(
    private val context: Context,
    private var datesGrid: List<List<String>>,
    private val onItemClick: Calenderfrg,
    private var dateList: List<CalenderResponse.EventDetail>, // List of dates with events

) : BaseAdapter() {

    fun updateDateColorList(newDateList: List<CalenderResponse.EventDetail>) {
        dateList = newDateList
        notifyDataSetChanged() // Notify adapter about data change
    }

    fun updateDates(newDatesGrid: List<List<String>>) {
        datesGrid = newDatesGrid
        notifyDataSetChanged()
    }

    override fun getCount(): Int {
        return datesGrid.flatten().size
    }

    override fun getItem(position: Int): Any {
        return datesGrid.flatten()[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    @RequiresApi(Build.VERSION_CODES.O)
    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        val inflater = LayoutInflater.from(context)
        val view = convertView ?: inflater.inflate(R.layout.grid_item_date, parent, false)

        val textView: TextView = view.findViewById(R.id.dateTextView)
        // val dotView: TextView = view.findViewById(R.id.dotView)
        val flatList = datesGrid.flatten()
        val item = flatList[position]

        val dayOfMonth = extractDayOfMonth(item)
        textView.gravity = Gravity.CENTER
        // Create a SpannableString to combine the day of the month with the dot
        val spannable = SpannableString(
            "$dayOfMonth\n${
                getDotText(
                    getEventCount(item),
                    getInvitedEventCount(item)
                )
            }"
        )

        // Set relative size for the dot to make it smaller
        spannable.setSpan(
            RelativeSizeSpan(1.0f),
            dayOfMonth.length,
            spannable.length,
            Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
        )

        // Set the SpannableString as the text of the date TextView
        textView.text = spannable

        if (getEventCount(item) == 0) {
            // Center horizontally and vertically
            textView.gravity = Gravity.CENTER
        } else {
            // Align top and center horizontally
            textView.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
        }

        if (isSunday(item)) {
            // Apply shadow effect for Sunday dates
            textView.background = ContextCompat.getDrawable(context, R.drawable.shadow_background)
        } else {
            // Remove shadow effect for other dates
            textView.background = null
        }

        Log.e("CalendarDateAdapters", "item.....New $item")
        //textView.text = formatDate(item)
        textView.setOnClickListener {
            onItemClick.onItemDateClick(item)
        }

        return view
    }

    /*  private fun getDotText(dotCount: Int): String {
          return if (dotCount > 0) "•" else ""
      }*/

    private fun getDotText(createdEventCount: Int, invitedEventCount: Int): CharSequence {
        Log.d("CalendarDateAdapter", "Created event count: $createdEventCount, Invited event count: $invitedEventCount")
        val dotColor = when {
            createdEventCount > 0 && invitedEventCount > 0 -> "#FF5A9C" // Both created and invited events
            createdEventCount > 0 -> "#FF5A9C" // Only created events
            invitedEventCount > 0 -> "#FF69B4" // Only invited events
            else -> "#000000" // No events (default color)
        }
        val dotText = when {
            createdEventCount > 0 && invitedEventCount > 0 -> "••" // Both created and invited events
            createdEventCount > 0 -> "•" // Only created events
            invitedEventCount > 0 -> "•" // Only invited events
            else -> "" // No events
        }
        return if (dotText.isNotEmpty()) {
            SpannableString(dotText).apply {
                // Set different colors for the dots if both counts are greater than 0
                if (createdEventCount > 0 && invitedEventCount > 0) {
                    setSpan(
                        ForegroundColorSpan(Color.parseColor("#FF5A9C")),
                        0, 1, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
                    )
                    setSpan(
                        ForegroundColorSpan(Color.parseColor("#FF69B4")),
                        1, 2, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
                    )
                } else {
                    // Apply the color to the single dot
                    setSpan(
                        ForegroundColorSpan(Color.parseColor(dotColor)),
                        0, dotText.length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
                    )
                }
            }
        } else {
            ""
        }
    }



    private fun extractDayOfMonth(date: String): String {
        // Split the date string by space and return the first part (the day of the month)
        return date.split(" ")[0]
    }

    private fun getEventCount(date: String): Int {
        // Find the event detail for the current date
        val eventDetail = dateList.find { it.date == date }
        return eventDetail?.createdEventCount ?: 0
    }


    private fun getInvitedEventCount(date: String): Int {
        // Find the event detail for the current date
        val eventDetail = dateList.find { it.date == date }
        return eventDetail?.invitedEventCount ?: 0
    }

    private fun isSunday(date: String): Boolean {
        try {
            val dateFormat = SimpleDateFormat("dd MMM, yyyy", Locale.getDefault())
            val calendar = Calendar.getInstance()
            val parsedDate = dateFormat.parse(date)
            if (parsedDate != null) {
                calendar.time = parsedDate
                return calendar.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY
            }
        } catch (e: ParseException) {
            e.printStackTrace()
        }
        return false
    }


}