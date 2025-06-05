const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

export const requestOTP = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Error requesting OTP:", error);
    throw error;
  }
};

export const validateOTP = async (body) => {
  try {
    const response = await fetch(`${BASE_URL}/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...body, page: "signin" }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error validating OTP:", error);
    throw error;
  }
};

export const resendOTP = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/resend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error resending OTP:", error);
    throw error;
  }
};

export const fetchAuditDataByID = async (token, reportId) => {
  try {
    const response = await fetch(`${BASE_URL}/fetchreport`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
      body: JSON.stringify({ reportId: reportId }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching report:", error);
    throw error;
  }
};

export const fetchReportList = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/pastreports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return data;
  } catch (error) {
    console.error("Error fetching report list:", error);
    throw error;
  }
};

export const triggerCheckReport = async (token, hubID) => {
  try {
    const response = await fetch(`${BASE_URL}/checkreport`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
      body: JSON.stringify({ hub_id: hubID }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while triggering check report:", error);
    throw error;
  }
};

export const triggerReportGeneration = async (token, hubID) => {
  try {
    const response = await fetch(`${BASE_URL}/getreport`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
      body: JSON.stringify({ hub_id: hubID }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while triggering report genearation:", error);
    throw error;
  }
};

export const fetchGraphData = async (token, reportId) => {
  try {
    const response = await fetch(`${BASE_URL}/checkandfetchgraph`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
      body: JSON.stringify({
        report_id: reportId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Error fetching graph data:`, error);
    throw error;
  }
};

export const fetchUserData = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/gethubinfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error while fetching user data:`, error);
    throw error;
  }
};

export const generateNewReport = async (token, hubId) => {
  try {
    const response = await fetch(`${BASE_URL}/generatenewreport`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
      body: JSON.stringify({ hub_id: hubId }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Error while fetching user data:`, error);
    throw error;
  }
};

export const addNewAccount = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/addnewaccount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(`Error while adding new hubspot portal:`, error);
    throw error;
  }
};

export const triggerGraphGeneration = async (token, reportId, hubId) => {
  try {
    const response = await fetch(`${BASE_URL}/savegraphs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
      body: JSON.stringify({ report_id: reportId, hub_id: hubId }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(`Error while adding new hubspot porta:`, error);
    throw error;
  }
};

export const triggerEmailNotification = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/sendemail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(`Error while sending email notification:`, error);
    throw error;
  }
};
export const handleJunkDataAction = async ({
  actionType,
  token,
  hubId,
  items,
  objectname = "deals",
}) => {
  const url =
    actionType === "create"
      ? `${BASE_URL}/createlist`
      : `${BASE_URL}/deleterecords`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
      body: JSON.stringify({
        objectname,
        propertynames: items,
        hubId,
      }),
    });

    const data = await response.json();

    // Use "result" object from API response
    const resultsFromApi = data.result || {};

    const results = {};
    items.forEach((item) => {
      const itemResult = resultsFromApi[item];

      results[item] = {
        success: itemResult?.success ?? false,
        message: itemResult?.message || "Unknown error",
      };
    });

    return {
      success: response.ok,
      results,
    };
  } catch (err) {
    const results = {};
    items.forEach((item) => {
      results[item] = {
        success: false,
        message: err.message || "Network or server error",
        listData: null,
      };
    });

    return {
      success: false,
      results,
    };
  }
};

export const checkReportGeneration = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/checkreportcreation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Error cehcking report generation:`, error);
    throw error;
  }
};

export const fetchAllReports = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/getallreports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return data;
  } catch (error) {
    console.error("Error fetching report list:", error);
    throw error;
  }
};

export const fetchSalesReportData = async (token, reportId) => {
  try {
    const response = await fetch(`${BASE_URL}/getsalesreport`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
      body: JSON.stringify({
        report_id: reportId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching sales report data:", error);
    throw error;
  }
};

export const checkSalesReportStatus = async (token, reportId) => {
  try {
    const response = await fetch(`${BASE_URL}/checksalesprogress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token, // JWT token from backend
      },
      body: JSON.stringify({
        report_id: reportId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to fetch sales report progress."
      );
    }

    return result.data; // This will be your progress_data
  } catch (error) {
    console.error("Error checking sales report status:", error.message);
    return null;
  }
};

export const fetchAllScores = async (token, reportId) => {
  try {
    const response = await fetch(`${BASE_URL}/getallscores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
      body: JSON.stringify({
        report_id: reportId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching all scores:", error);
    throw error;
  }
};

export const fetchSalesActionData = async (token, reportId) => {
  try {
    const response = await fetch(`${BASE_URL}/fetchsalesactiondata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
      body: JSON.stringify({
        report_id: reportId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching sales action data:", error);
    throw error;
  }
};

export const fetchSalesGraphData = async (token, reportId) => {
  try {
    const response = await fetch(`${BASE_URL}/fetchsalesgraphdata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
      body: JSON.stringify({
        report_id: reportId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Error fetching graph data:`, error);
    throw error;
  }
};

export const fetchLastActivityDate = async (token, email, reportId) => {
  try {
    const response = await fetch(`${BASE_URL}/getlastactivitydate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
      body: JSON.stringify({
        email: email,
        report_id: reportId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Error fetching graph data:`, error);
    throw error;
  }
};

export const sendBulkEmailToReps = async (token, payload) => {
  try {
    const response = await fetch(`${BASE_URL}/sendemailtoreps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending bulk email:", error);
    throw error;
  }
};

export const checkReportProgressViaReportId = async (
  token,
  reportId,
  hubId
) => {
  try {
    const response = await fetch(`${BASE_URL}/checkprogressviareportid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
      body: JSON.stringify({
        report_id: reportId,
        hub_id: hubId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking report progress:", error);
    throw error;
  }
};

export const checkAdminStatus = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/checkadmin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking admin status:", error);
    throw error;
  }
};

export const uploadPartnerData = async (formData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/submit_partner_details`, {
      method: "POST",
      body: formData,
      headers: {
        state: token,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading agency data:", error);
    throw error;
  }
};

export const fetchThemeDetails = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/get_themes_and_fonts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching agency details:", error);
    throw error;
  }
};

export const checkUserType = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/getusertype`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking user type:", error);
    throw error;
  }
};

export const addUsertoPartner = async (token, userData) => {
  try {
    const response = await fetch(`${BASE_URL}/addusertopartner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding user to agency:", error);
    throw error;
  }
};

export const addPartnertoPartner = async (token, userData) => {
  try {
    const response = await fetch(`${BASE_URL}/addpartner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding user to agency:", error);
    throw error;
  }
};

export const shareReport = async (
  token,
  report_id,
  email,
  hub_id,
  audit_date,
  audit_score,
  report_link
) => {
  try {
    const response = await fetch(`${BASE_URL}/sharereport`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
      body: JSON.stringify({
        report_id,
        email,
        hub_id,
        audit_date,
        audit_score,
        report_link,
      }),
    });
    return await response.json();
  } catch (err) {
    console.error("API error in shareReport:", err);
    return { success: false, message: "API call failed." };
  }
};

export const fetchSharedReports = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/fetchsharedreport`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching shared reports:", error);
    throw error;
  }
};

export const fetchThemeSettings = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/getthemeandlogo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token, // send user token if required for auth
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching theme settings: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching theme settings:", error);
    throw error;
  }
};

export const fetchUsersOfPartner = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/getusersofpartner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching user of agency: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user of agency:", error);
    throw error;
  }
};

export const fetchPartnerData = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/getpartnerdata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching agency details: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching agency details:", error);
    throw error;
  }
};

export const fetchPartnerThemeAndLogo = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/getpartnerthemeandlogo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching agency theme and logo: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching agency theme and logo:", error);
    throw error;
  }
};

export const fetchPricingDetails = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/Subscription-plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching pricing details: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pricing details:", error);
    throw error;
  }
};

export const fetchUserCredits = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/getcredits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching user credits: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user credits:", error);
    throw error;
  }
};

export const fetchUserPlan = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/get_users_subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching user plan: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user plan:", error);
    throw error;
  }
};

export const fetchCreditUsage = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/get_credit_usage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching credit usage: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching credit usage:", error);
    throw error;
  }
};

export const fetchPartnerRole = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/getpartnerrole`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        state: token,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching agency role: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching agency role:", error);
    throw error;
  }
};
