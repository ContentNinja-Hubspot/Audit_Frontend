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
    return data;
  } catch (error) {
    console.error("Error requesting OTP:", error);
    throw error;
  }
};

export const validateOTP = async (email, otp) => {
  try {
    const response = await fetch(`${BASE_URL}/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, otp: otp, page: "signin" }),
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
  item,
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
        propertynames: [item],
        hubId,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data[item]?.message || data.message || "Success",
      };
    } else {
      return {
        success: false,
        message:
          data[item]?.error?.message ||
          data.error?.message ||
          "Something went wrong",
      };
    }
  } catch (err) {
    return {
      success: false,
      message: err.message || "Network or server error",
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
