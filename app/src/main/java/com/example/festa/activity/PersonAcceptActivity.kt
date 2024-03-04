package com.example.festa.activity

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.festa.R
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class PersonAcceptActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_person_accept)
    }
}