package io.ionic.starter;

import android.os.Bundle;
import com.getcapacitor.Plugin;
import com.getcapacitor.BridgeActivity;
import java.util.ArrayList;
import com.hemangkumar.capacitorgooglemaps.CapacitorGoogleMaps;
import com.dutchconcepts.capacitor.barcodescanner.BarcodeScanner;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;

public class MainActivity extends BridgeActivity {

  // https://capacitorjs.com/docs/updating/3-0#switch-to-automatic-android-plugin-loading
  // In Capacitor 3, it is preferred to automatically load the Android plugins. In MainActivity.java,
  // the onCreate method can be removed. You no longer have to edit this file when adding or removing plugins
  // installed via npm.


  //  @Override
  //   public void onCreate(Bundle savedInstanceState) {
  //     super.onCreate(savedInstanceState);
  //     registerPlugin(CapacitorGoogleMaps.class);
  //   }

    //  @Override
    // public void onCreate(Bundle savedInstanceState) {
    //   super.onCreate(savedInstanceState);
    //   this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
    //     add(GoogleAuth.class);
    //   }});
    // }

  // @Override
  // public void onCreate(Bundle savedInstanceState) {
  //   super.onCreate(savedInstanceState);

  //   // Initializes the Bridge
  //   this.init(
  //       savedInstanceState,
  //       new ArrayList<Class<? extends Plugin>>() {
  //         {
  //           // Additional plugins you've installed go here
  //           // Ex: add(TotallyAwesomePlugin.class);
  //           add(BarcodeScanner.class);
  //         }
  //       }
  //     );
  // }
}
