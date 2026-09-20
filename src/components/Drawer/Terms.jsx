import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { Modal, ScrollView } from 'native-base'

const Terms = () => {
  return (
    <View style={{flex:1}}>
    <View style={{marginHorizontal:10}}>
      
      
  
        <View >
    

         
            <ScrollView >
            <Text >End User License Agreement (EULA)</Text>
          <Text >1. Introduction</Text>
          <Text >Linkpii is an application that allows users to generate, submit, and sell content. By using the Application, you agree to comply with and be bound by this Agreement.</Text>
          <Text >2. License Grant</Text>
          <Text >Linkpii grants you a revocable, non-exclusive, non-transferable, limited license to download, install, and use the Application strictly in accordance with the terms of this Agreement.</Text>
          <Text >3. User-Generated Content</Text>
          <Text >Users may generate, submit, and sell content through the Application ("User-Generated Content"). By creating or submitting User-Generated Content, you grant Linkpii a worldwide, non-exclusive, royalty-free, transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the User-Generated Content in connection with the Application and Linkpii's business, including without limitation for promoting and redistributing part or all of the Application (and derivative works thereof) in any media formats and through any media channels.</Text>

          
              <Text >4. Ownership of Content</Text>
              <Text >You retain all ownership rights in your User-Generated Content. Linkpii does not claim any ownership rights in your User-Generated Content.</Text>
              <Text >5. Responsibility for Content</Text>
              <Text >You are solely responsible for your User-Generated Content and the consequences of submitting and publishing your User-Generated Content on the Application. You affirm, represent, and warrant that you own or have the necessary licenses, rights, consents, and permissions to publish the User-Generated Content and to grant Linkpii the rights granted by this Agreement.</Text>
              <Text >6. Prohibited Content</Text>
              <Text >You agree not to post, upload, publish, submit, or transmit any User-Generated Content that: Violates, or encourages any conduct that would violate, any applicable law or regulation or would give rise to civil liability; Is fraudulent, false, misleading, or deceptive; Is defamatory, obscene, pornographic, vulgar, or offensive; Promotes discrimination, bigotry, racism, hatred, harassment, or harm against any individual or group; Is violent or threatening or promotes violence or actions that are threatening to any person or entity; Promotes illegal or harmful activities or substances.</Text>
              <Text >7. Content Review</Text>
              <Text >Linkpii does not endorse any User-Generated Content or any opinion, recommendation, or advice expressed therein, and Linkpii expressly disclaims any and all liability in connection with User-Generated Content. Linkpii reserves the right to remove, screen, or edit any User-Generated Content posted or stored on the Application at any time and without notice.</Text>
              <Text >8. User Conduct</Text>
              <Text >As a condition of use, you agree not to use the Application for any purpose that is unlawful or prohibited by this Agreement, or any other purpose not reasonably intended by Linkpii.</Text>
              <Text >9. Transactions </Text>
              <Text >All transactions involving User-Generated Content, including but not limited to pricing, delivery, and performance of services, are the sole responsibility of the User who provides such content. Linkpii is not responsible for and does not guarantee the performance of any transaction initiated through the Application.</Text>
              <Text >10. Payment and Fees</Text>
              <Text >Linkpii may charge fees for the use of certain services provided through the Application. Any applicable fees will be communicated to you before you incur them. You are responsible for paying all fees and applicable taxes associated with your use of the Application.</Text>
              <Text >11. Indemnification</Text>
              <Text >You agree to defend, indemnify, and hold harmless Linkpii, its officers, directors, employees, and agents, from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the Application, your User-Generated Content, or your violation of this Agreement.</Text>
              <Text >12. Disclaimer of Warranties</Text>
              <Text >The Application is provided to you 'AS IS' and 'AS AVAILABLE' and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, Linkpii, on its own behalf and on behalf of its affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Application.</Text>
              <Text >13. Limitation of Liability </Text>
              <Text >Notwithstanding any damages that you might incur, the entire liability of Linkpii and any of its suppliers under any provision of this Agreement and your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by you for the Application.</Text>
              <Text >14. Governing Law </Text>
              <Text >This Agreement shall be governed by and construed in accordance with the laws of Ghana, without regard to its conflict of law principles.</Text>
              <Text >15. Delivery</Text>
              <Text >Delivery before payement. Do not give money to an undelivered item</Text>
              <Text >16. Contact Information </Text>
              <Text >If you have any questions about this Agreement, please contact us at ericokyere018@gmail.com.</Text>
              <Text >17. Acknowledgment </Text>
              <Text >By downloading, installing, or using the Application, you acknowledge that you have read and understood this Agreement and agree to be bound by its terms and conditions.</Text>
            </ScrollView>
          

         
        </View>

    </View>
    </View>
  )
}

export default Terms;


const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  btnText: {
    fontSize: 16,
    fontFamily: "regular",
  },
  btncont: {
    backgroundColor: "#f5a53d",
    padding: 12,
    borderRadius: 20,
  },
  err: {
    color: "red",
  },
  loginPrompt: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  promptText: {
    color: "#f5a53d",
    fontFamily: "regular",
    top: 10,
    fontSize: 14,
    marginRight:10
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  eulaContent: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: "justify",
  },
  readMore: {
    color: "blue",
    textDecorationLine: "underline",
  },
  fullEula: {
    maxHeight: 200,
  },
  agreeButton: {
    backgroundColor: "#f5a53d",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
  },
});



