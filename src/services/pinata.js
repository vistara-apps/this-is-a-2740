import { API_CONFIG } from '../config/api.js'

// Pinata IPFS service for decentralized file storage
class PinataService {
  constructor() {
    this.apiKey = API_CONFIG.pinata.apiKey
    this.secretKey = API_CONFIG.pinata.secretKey
    this.baseUrl = API_CONFIG.pinata.baseUrl
  }

  async makeRequest(endpoint, data, isFormData = false) {
    if (!this.apiKey || !this.secretKey) {
      throw new Error('Pinata API credentials not configured')
    }

    const headers = {
      'pinata_api_key': this.apiKey,
      'pinata_secret_api_key': this.secretKey
    }

    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: isFormData ? data : JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`Pinata API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Pinata API request failed:', error)
      throw error
    }
  }

  // Upload file to IPFS via Pinata
  async uploadFile(file, metadata = {}) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      // Add metadata
      const pinataMetadata = {
        name: metadata.name || file.name,
        keyvalues: {
          type: metadata.type || 'incident-recording',
          timestamp: new Date().toISOString(),
          ...metadata.keyvalues
        }
      }

      formData.append('pinataMetadata', JSON.stringify(pinataMetadata))

      // Add pinning options
      const pinataOptions = {
        cidVersion: 1,
        wrapWithDirectory: false
      }

      formData.append('pinataOptions', JSON.stringify(pinataOptions))

      const response = await this.makeRequest('/pinning/pinFileToIPFS', formData, true)
      
      return {
        success: true,
        ipfsHash: response.IpfsHash,
        pinSize: response.PinSize,
        timestamp: response.Timestamp,
        url: `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`,
        metadata: pinataMetadata
      }
    } catch (error) {
      console.error('File upload to Pinata failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Upload JSON data to IPFS
  async uploadJSON(jsonData, metadata = {}) {
    try {
      const data = {
        pinataContent: jsonData,
        pinataMetadata: {
          name: metadata.name || 'incident-report',
          keyvalues: {
            type: metadata.type || 'incident-data',
            timestamp: new Date().toISOString(),
            ...metadata.keyvalues
          }
        },
        pinataOptions: {
          cidVersion: 1
        }
      }

      const response = await this.makeRequest('/pinning/pinJSONToIPFS', data)
      
      return {
        success: true,
        ipfsHash: response.IpfsHash,
        pinSize: response.PinSize,
        timestamp: response.Timestamp,
        url: `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`,
        data: jsonData
      }
    } catch (error) {
      console.error('JSON upload to Pinata failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get file info from IPFS hash
  async getFileInfo(ipfsHash) {
    try {
      const response = await fetch(`${this.baseUrl}/data/pinList?hashContains=${ipfsHash}`, {
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get file info: ${response.status}`)
      }

      const data = await response.json()
      return data.rows[0] || null
    } catch (error) {
      console.error('Failed to get file info:', error)
      return null
    }
  }

  // Unpin file from IPFS (delete)
  async unpinFile(ipfsHash) {
    try {
      const response = await fetch(`${this.baseUrl}/pinning/unpin/${ipfsHash}`, {
        method: 'DELETE',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to unpin file: ${response.status}`)
      }

      return { success: true }
    } catch (error) {
      console.error('Failed to unpin file:', error)
      return { success: false, error: error.message }
    }
  }

  // Generate shareable link for incident report
  generateShareableLink(ipfsHash, reportData) {
    const baseUrl = window.location.origin
    const shareData = {
      ipfsHash,
      timestamp: reportData.timestamp,
      location: reportData.location,
      type: 'incident-report'
    }
    
    const encodedData = btoa(JSON.stringify(shareData))
    return `${baseUrl}/shared/${encodedData}`
  }

  // Upload incident recording with metadata
  async uploadIncidentRecording(audioBlob, incidentData) {
    try {
      // Create file from blob
      const file = new File([audioBlob], `incident-${Date.now()}.webm`, {
        type: 'audio/webm'
      })

      // Upload audio file
      const audioResult = await this.uploadFile(file, {
        name: `incident-recording-${incidentData.timestamp}`,
        type: 'incident-recording',
        keyvalues: {
          userId: incidentData.userId,
          timestamp: incidentData.timestamp,
          location: JSON.stringify(incidentData.location),
          duration: incidentData.duration.toString()
        }
      })

      if (!audioResult.success) {
        throw new Error('Failed to upload audio file')
      }

      // Upload incident metadata
      const metadataResult = await this.uploadJSON({
        audioHash: audioResult.ipfsHash,
        timestamp: incidentData.timestamp,
        location: incidentData.location,
        notes: incidentData.notes,
        duration: incidentData.duration,
        userId: incidentData.userId
      }, {
        name: `incident-metadata-${incidentData.timestamp}`,
        type: 'incident-metadata'
      })

      return {
        success: true,
        audioHash: audioResult.ipfsHash,
        metadataHash: metadataResult.ipfsHash,
        audioUrl: audioResult.url,
        metadataUrl: metadataResult.url,
        shareableLink: this.generateShareableLink(metadataResult.ipfsHash, incidentData)
      }
    } catch (error) {
      console.error('Failed to upload incident recording:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Test connection to Pinata
  async testConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/data/testAuthentication`, {
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey
        }
      })

      return response.ok
    } catch (error) {
      console.error('Pinata connection test failed:', error)
      return false
    }
  }
}

export const pinataService = new PinataService()
