package com.example.festa.ui.theme.bookmark.ui

import android.app.Activity
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.festa.application.Festa
import com.example.festa.databinding.ActivityBookMarkBinding

import com.example.festa.view.guest.viewmodel.bookmarkget.BookMarkGetViewModel
import com.example.festa.ui.theme.bookmark.BookMarkGetAdapter
import com.example.festa.ui.theme.bookmark.model.BookMarkGetResponse
import com.johncodeos.customprogressdialogexample.CustomProgressDialog
import dagger.hilt.android.AndroidEntryPoint
import java.util.*
import kotlin.collections.ArrayList

@AndroidEntryPoint
class BookMark : AppCompatActivity() {
    lateinit var binding: ActivityBookMarkBinding
    lateinit var activity: Activity
    private val bookMarkGetViewModel: BookMarkGetViewModel by viewModels()
    private val progressDialog by lazy { CustomProgressDialog(this) }
    private var eventId = ""
    private var customAdapter: BookMarkGetAdapter? = null
    private var isValue = false
    private var bookMarkList: List<BookMarkGetResponse.AllCollection> = ArrayList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityBookMarkBinding.inflate(layoutInflater)
        setContentView(binding.root)

        activity = this
        eventId = intent.getStringExtra("eventId").toString()

        Log.e("BookMarkId", "eventId$eventId")

        binding.backarrowLayout.setOnClickListener {
            finish()
        }

        binding.searchIcon.setOnClickListener {
            toggleTextVisibility()
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

        binding.searchIcon.setOnClickListener {
            binding.backarrowbookmark.visibility = View.GONE
            binding.bookMarkTxt.visibility = View.GONE
            binding.searchIcon.visibility = View.GONE
            binding.search.visibility = View.VISIBLE
        }

        binding.close.setOnClickListener {
            binding.backarrowbookmark.visibility = View.VISIBLE
            binding.bookMarkTxt.visibility = View.VISIBLE
            binding.searchIcon.visibility = View.VISIBLE
            binding.search.visibility = View.GONE
        }

        getBooMarkList()
        bookMarkObserver()
    }

    private fun getBooMarkList() {
        bookMarkGetViewModel.getBookMark(progressDialog, activity, eventId)
    }

    private fun bookMarkObserver() {
        bookMarkGetViewModel.progressIndicator.observe(this) {
        }
        bookMarkGetViewModel.mguestlist.observe(this) {
            val message = it.peekContent().message


            val success = it.peekContent().success
            if (success == true) {
                bookMarkList = it.peekContent().allCollections!!

                binding.bookmarkRecycle.visibility = View.VISIBLE

                val collectionId = it.peekContent().AllCollection().collectionId
                Festa.encryptedPrefs.collectionId = collectionId.toString()

                binding.bookmarkRecycle.isVerticalScrollBarEnabled = true
                binding.bookmarkRecycle.isVerticalFadingEdgeEnabled = true
                binding.bookmarkRecycle.layoutManager =
                    LinearLayoutManager(this@BookMark, LinearLayoutManager.VERTICAL, false)
                customAdapter = BookMarkGetAdapter(this@BookMark, bookMarkList)
                binding.bookmarkRecycle.adapter = customAdapter
            } else {
                binding.noDataFoundTxt.visibility = View.VISIBLE
            }


            Log.e("bookMarkListbookMarkList", "bookMarkList" + bookMarkList.size)


        }

        bookMarkGetViewModel.errorResponse.observe(this) {
            com.freqwency.promotr.utils.ErrorUtil.handlerGeneralError(this@BookMark, it)
            //errorDialogs()
        }
    }

    private fun filterList(query: String?) {
        if (query != null) {
            val filterList = ArrayList<BookMarkGetResponse.AllCollection>()
            for (i in bookMarkList) {
                if (i.collectionName?.lowercase(Locale.ROOT)?.contains(query) == true) {
                    filterList.add(i)
                }
            }
            if (filterList.isEmpty()) {
                Toast.makeText(this@BookMark, "No Data found ", Toast.LENGTH_LONG).show()
            } else {
                customAdapter?.setFilteredList(filterList)
            }
        }
    }

    private fun toggleTextVisibility() {
        isValue = !isValue
        if (isValue) {
            binding.backarrowbookmark.visibility = View.GONE
            binding.bookMarkTxt.visibility = View.GONE
            binding.search.visibility = View.VISIBLE
        } else {
            binding.backarrowbookmark.visibility = View.VISIBLE
            binding.bookMarkTxt.visibility = View.VISIBLE
            binding.search.visibility = View.GONE
        }
    }
}