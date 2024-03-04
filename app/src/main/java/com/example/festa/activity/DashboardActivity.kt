package com.example.festa.activity

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.widget.FrameLayout
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.festa.fragments.bookmarktabFgmt.ChatFragment
import com.example.festa.fragments.calender.Calenderfrg
import com.example.festa.fragments.Homepage
import com.example.festa.view.profile.ui.ProfileFragment
import com.example.festa.R
import com.example.festa.application.Festa
import com.example.festa.databinding.ActivityDashboardBinding
import com.example.festa.view.createevents.ui.CreateEventFragment
import com.example.festa.view.events.ui.EventListFragment
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class DashboardActivity : AppCompatActivity() {
    private lateinit var binding: ActivityDashboardBinding
    private val shouldLoadHomeFragOnBackPress = true
    private var doubleBackToExitPressedOnce = false
    private var navItemIndex = 0
    private val TAG_DASH_BOARD = "dashboard"
    private var CURRENT_TAG = TAG_DASH_BOARD
    private val TAG_NEXT = "next"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val reserveReceived = intent.getStringExtra("login").toString()


        if (reserveReceived == "login") {

            val eventListFrg = EventListFragment()
            replace_fragment(eventListFrg)

            binding.homeBtn.setImageResource(R.drawable.home_second)
            binding.calender.setImageResource(R.drawable.calendar1)
            binding.chat.setImageResource(R.drawable.bookmark_tab)
            binding.profile.setImageResource(R.drawable.account_first)

            binding.homeLayout.setOnClickListener {
                navItemIndex = 1
                CURRENT_TAG = TAG_NEXT
                binding.homeBtn.setImageResource(R.drawable.home_second)
                binding.calender.setImageResource(R.drawable.calendar1)
                binding.chat.setImageResource(R.drawable.bookmark_tab)
                binding.profile.setImageResource(R.drawable.account_first)

                val eventListFragment = EventListFragment()
                replace_fragment(eventListFragment)
            }

            binding.calenderLayout.setOnClickListener {
                navItemIndex = 1
                CURRENT_TAG = TAG_NEXT
                binding.homeBtn.setImageResource(R.drawable.home_first)
                binding.calender.setImageResource(R.drawable.calendar2)
                binding.chat.setImageResource(R.drawable.bookmark_tab)
                binding.profile.setImageResource(R.drawable.account_first)

                val createEventfrg = Calenderfrg()
                replace_fragment(createEventfrg)
            }

            binding.homeplus.setOnClickListener {
                navItemIndex = 1
                CURRENT_TAG = TAG_NEXT
                binding.homeBtn.setImageResource(R.drawable.home_first)
                binding.calender.setImageResource(R.drawable.calendar1)
                binding.chat.setImageResource(R.drawable.bookmark_tab)
                binding.profile.setImageResource(R.drawable.account_first)
                Festa.encryptedPrefs.eventIds = ""
                val createEventFragment = CreateEventFragment()
                replace_fragment(createEventFragment)
            }

            binding.chatLayout.setOnClickListener {
                navItemIndex = 1
                CURRENT_TAG = TAG_NEXT
                binding.homeBtn.setImageResource(R.drawable.home_first)
                binding.calender.setImageResource(R.drawable.calendar1)
                binding.chat.setImageResource(R.drawable.bookmark_fill_tab)
                binding.profile.setImageResource(R.drawable.account_first)

                val createEventfrg = ChatFragment()
                replace_fragment(createEventfrg)
            }

            binding.profileLayout.setOnClickListener {
                navItemIndex = 1
                CURRENT_TAG = TAG_NEXT
                binding.homeBtn.setImageResource(R.drawable.home_first)
                binding.calender.setImageResource(R.drawable.calendar1)
                binding.chat.setImageResource(R.drawable.bookmark_tab)
                binding.profile.setImageResource(R.drawable.account_second)

                val createEventfrg = ProfileFragment()
                replace_fragment(createEventfrg)
            }

        } else {
            val eventListFrg = Homepage()
            replace_fragment(eventListFrg)
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (shouldLoadHomeFragOnBackPress) {
            if (navItemIndex != 0) {
                navItemIndex = 0
                CURRENT_TAG = TAG_DASH_BOARD
                val eventListFragment = EventListFragment()
                back_fragment(eventListFragment)
                Festa.encryptedPrefs.eventIds = ""
            } else {
                if (doubleBackToExitPressedOnce) {
                    //super.onBackPressed()
                    onBackPressedDispatcher.onBackPressed()
                    return
                }
                doubleBackToExitPressedOnce = true
                Toast.makeText(this, "Please click BACK again to exit", Toast.LENGTH_SHORT).show()
                Handler(Looper.getMainLooper()).postDelayed({
                    // Your Code
                    doubleBackToExitPressedOnce = false
                }, 2000)
            }
        }
    }

    private fun back_fragment(fragment: Fragment) {
        binding.homeBtn.setImageResource(R.drawable.home_second)
        binding.calender.setImageResource(R.drawable.calendar1)
        binding.chat.setImageResource(R.drawable.chats_first)
        binding.profile.setImageResource(R.drawable.account_first)

        val fragmentManager = supportFragmentManager
        (findViewById<View>(R.id.containers) as FrameLayout).removeAllViews()
        val fragmentTransaction = fragmentManager.beginTransaction()
        fragmentTransaction.replace(R.id.containers, fragment)
        fragmentTransaction.commit()
    }

    private fun replace_fragment(fragment: Fragment) {
        val fragmentManager = supportFragmentManager
        (findViewById<View>(R.id.containers) as FrameLayout).removeAllViews()
        val fragmentTransaction = fragmentManager.beginTransaction()
        fragmentTransaction.replace(R.id.containers, fragment)
        fragmentTransaction.commit()
    }
}