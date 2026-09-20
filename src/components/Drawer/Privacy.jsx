import { View, Text } from 'react-native'
import React from 'react'
import { ScrollView } from 'native-base'

const Privacy = () => {
  return (
    <ScrollView>
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Privacy Policy</Text>
      <Text style={{ marginBottom: 16 }}>
        This privacy policy applies to the Linkpii app (hereby referred to as "Application") for mobile devices that was created by Eric Okyere (hereby referred to as "Service Provider") as a Free service. This service is intended for use "AS IS".
      </Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Information Collection and Use</Text>
      <Text style={{ marginBottom: 16 }}>
        The Application collects information when you download and use it. This information may include:
      </Text>
      <Text style={{ marginLeft: 16, marginBottom: 8 }}>• Your device's Internet Protocol address (e.g. IP address)</Text>
      <Text style={{ marginLeft: 16, marginBottom: 8 }}>• The pages of the Application that you visit, the time and date of your visit, the time spent on those pages</Text>
      <Text style={{ marginLeft: 16, marginBottom: 8 }}>• The time spent on the Application</Text>
      <Text style={{ marginLeft: 16, marginBottom: 8 }}>• The operating system you use on your mobile device</Text>
      <Text style={{ marginBottom: 16 }}>
        The Application does not gather precise information about the location of your mobile device. The Application collects your device's location, which helps the Service Provider determine your approximate geographical location and make use of it in the following ways:
      </Text>
      <Text style={{ marginLeft: 16, marginBottom: 8 }}>• Geolocation Services: The Service Provider utilizes location data to provide features such as personalized content, relevant recommendations, and location-based services.</Text>
      <Text style={{ marginLeft: 16, marginBottom: 8 }}>• Analytics and Improvements: Aggregated and anonymized location data helps the Service Provider to analyze user behavior, identify trends, and improve the overall performance and functionality of the Application.</Text>
      <Text style={{ marginLeft: 16, marginBottom: 16 }}>• Third-Party Services: Periodically, the Service Provider may transmit anonymized location data to external services. These services assist them in enhancing the Application and optimizing their offerings.</Text>

      <Text style={{ marginBottom: 16 }}>
        The Service Provider may use the information you provided to contact you from time to time to provide you with important information, required notices, and marketing promotions.
      </Text>
      <Text style={{ marginBottom: 16 }}>
        For a better experience, while using the Application, the Service Provider may require you to provide us with certain personally identifiable information, including but not limited to ericokyere018@gmail.com. The information that the Service Provider requests will be retained by them and used as described in this privacy policy.
      </Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Third Party Access</Text>
      <Text style={{ marginBottom: 16 }}>
        Only aggregated, anonymized data is periodically transmitted to external services to aid the Service Provider in improving the Application and their service. The Service Provider may share your information with third parties in the ways that are described in this privacy statement.
      </Text>
      <Text style={{ marginBottom: 16 }}>
        Please note that the Application utilizes third-party services that have their own Privacy Policy about handling data. Below are the links to the Privacy Policy of the third-party service providers used by the Application:
      </Text>
      <Text style={{ marginLeft: 16, marginBottom: 16 }}>• Google Play Services</Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Disclosure of Information</Text>
      <Text style={{ marginBottom: 16 }}>
        The Service Provider may disclose User Provided and Automatically Collected Information:
      </Text>
      <Text style={{ marginLeft: 16, marginBottom: 8 }}>• as required by law, such as to comply with a subpoena, or similar legal process;</Text>
      <Text style={{ marginLeft: 16, marginBottom: 8 }}>• when they believe in good faith that disclosure is necessary to protect their rights, protect your safety or the safety of others, investigate fraud, or respond to a government request;</Text>
      <Text style={{ marginLeft: 16, marginBottom: 16 }}>• with their trusted service providers who work on their behalf, do not have an independent use of the information we disclose to them, and have agreed to adhere to the rules set forth in this privacy statement.</Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Opt-Out Rights</Text>
      <Text style={{ marginBottom: 16 }}>
        You can stop all collection of information by the Application easily by uninstalling it. You may use the standard uninstall processes as may be available as part of your mobile device or via the mobile application marketplace or network.
      </Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Data Retention Policy</Text>
      <Text style={{ marginBottom: 16 }}>
        The Service Provider will retain User Provided data for as long as you use the Application and for a reasonable time thereafter. If you'd like them to delete User Provided Data that you have provided via the Application, please contact them at ericokyere018@gmail.com and they will respond in a reasonable time.
      </Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Children</Text>
      <Text style={{ marginBottom: 16 }}>
        The Service Provider does not use the Application to knowingly solicit data from or market to children under the age of 13. The Application does not address anyone under the age of 13. The Service Provider does not knowingly collect personally identifiable information from children under 13 years of age. In the case the Service Provider discovers that a child under 13 has provided personal information, the Service Provider will immediately delete this from their servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact the Service Provider (ericokyere018@gmail.com) so that they will be able to take the necessary actions.
      </Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Security</Text>
      <Text style={{ marginBottom: 16 }}>
        The Service Provider is concerned about safeguarding the confidentiality of your information. The Service Provider provides physical, electronic, and procedural safeguards to protect information the Service Provider processes and maintains.
      </Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Changes</Text>
      <Text style={{ marginBottom: 16 }}>
        This Privacy Policy may be updated from time to time for any reason. The Service Provider will notify you of any changes to the Privacy Policy by updating this page with the new Privacy Policy. You are advised to consult this Privacy Policy regularly for any changes, as continued use is deemed approval of all changes.
      </Text>

      <Text style={{ marginBottom: 16 }}>This privacy policy is effective as of 2024-07-09</Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Your Consent</Text>
      <Text style={{ marginBottom: 16 }}>
        By using the Application, you are consenting to the processing of your information as set forth in this Privacy Policy now and as amended by us.
      </Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Contact Us</Text>
      <Text>
        If you have any questions regarding privacy while using the Application, or have questions about the practices, please contact the Service Provider via email at ericokyere018@gmail.com.
      </Text>
    </View>
    </ScrollView>
  )
}

export default Privacy
