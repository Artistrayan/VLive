package com.example

import android.os.Bundle
import android.view.WindowManager
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.ui.screens.MainMiniAppContainer
import com.example.ui.theme.MyApplicationTheme
import com.example.viewmodel.AppViewModel

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    // Clear FLAG_SECURE so that the browser streaming preview canvas can render the app UI
    window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
    enableEdgeToEdge()
    setContent {
      MyApplicationTheme {
        val appViewModel: AppViewModel = viewModel()
        MainMiniAppContainer(viewModel = appViewModel)
      }
    }
  }
}


