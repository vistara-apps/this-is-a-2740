import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Pause, Download, Share2, MapPin, Clock, AlertCircle } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useUser } from '../context/UserContext'

const Recording = () => {
  const { user } = useUser()
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [hasPermission, setHasPermission] = useState(false)
  const [recordings, setRecordings] = useState([])
  const [notes, setNotes] = useState('')
  const [location, setLocation] = useState(null)
  
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    checkPermissions()
    getCurrentLocation()
    loadSavedRecordings()
  }, [])

  const checkPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setHasPermission(true)
      stream.getTracks().forEach(track => track.stop())
    } catch (error) {
      setHasPermission(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date().toISOString()
          })
        },
        (error) => {
          console.log('Location access denied')
        }
      )
    }
  }

  const loadSavedRecordings = () => {
    const saved = localStorage.getItem('incident-recordings')
    if (saved) {
      setRecordings(JSON.parse(saved))
    }
  }

  const saveRecording = (recording) => {
    const updatedRecordings = [...recordings, recording]
    setRecordings(updatedRecordings)
    localStorage.setItem('incident-recordings', JSON.stringify(updatedRecordings))
  }

  const startRecording = async () => {
    if (!hasPermission) {
      await checkPermissions()
      if (!hasPermission) return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        
        const recording = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          duration: recordingTime,
          notes: notes,
          location: location,
          audioUrl: url,
          blob: blob
        }
        
        saveRecording(recording)
        setNotes('')
        setRecordingTime(0)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setIsPaused(false)
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1)
        }, 1000)
      } else {
        mediaRecorderRef.current.pause()
        clearInterval(timerRef.current)
      }
      setIsPaused(!isPaused)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      setIsPaused(false)
      clearInterval(timerRef.current)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const downloadRecording = (recording) => {
    const a = document.createElement('a')
    a.href = recording.audioUrl
    a.download = `incident-recording-${new Date(recording.timestamp).toISOString().slice(0, 10)}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const shareRecording = async (recording) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Incident Recording',
          text: `Recorded on ${new Date(recording.timestamp).toLocaleDateString()}`,
          files: [new File([recording.blob], 'recording.webm', { type: 'audio/webm' })]
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback - copy link or show share options
      navigator.clipboard.writeText(recording.audioUrl)
    }
  }

  if (!hasPermission) {
    return (
      <div className="space-y-6 pb-20 lg:pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Record Incident</h1>
          <p className="text-gray-400">Document interactions with law enforcement</p>
        </div>
        
        <Card className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Microphone Permission Required</h2>
          <p className="text-gray-400 mb-6">
            To record incidents, we need access to your microphone. 
            This helps ensure accurate documentation of interactions.
          </p>
          <Button onClick={checkPermissions}>Grant Permission</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Record Incident</h1>
        <p className="text-gray-400">Document interactions with law enforcement</p>
      </div>

      {/* Emergency Recording */}
      <Card className="bg-red-900/20 border border-red-700">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`relative ${isRecording ? 'animate-pulse' : ''}`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isRecording ? 'bg-red-600' : 'bg-red-700 hover:bg-red-600'
              } transition-colors cursor-pointer`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? (
                  <Square className="h-8 w-8 text-white" />
                ) : (
                  <Mic className="h-8 w-8 text-white" />
                )}
              </div>
              {isRecording && (
                <div className="absolute -inset-2 rounded-full border-2 border-red-400 animate-pulse" />
              )}
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-2">
            {isRecording ? 'Recording...' : 'Start Recording'}
          </h2>
          
          {isRecording && (
            <div className="space-y-4">
              <div className="text-2xl font-mono text-red-300">
                {formatTime(recordingTime)}
              </div>
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="secondary" 
                  onClick={pauseRecording}
                  className="flex items-center"
                >
                  {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={stopRecording}
                  className="flex items-center"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>
            </div>
          )}
          
          {!isRecording && (
            <p className="text-gray-400">
              Tap the microphone to start recording immediately
            </p>
          )}
        </div>
      </Card>

      {/* Recording Notes */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Incident Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about the incident (location, officers, circumstances, etc.)"
          className="input-field h-32 resize-none"
        />
      </Card>

      {/* Location Info */}
      {location && (
        <Card>
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-white">Current Location</h4>
              <p className="text-gray-400 text-sm">
                Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
              </p>
              <p className="text-gray-500 text-xs">
                Recorded at {new Date(location.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Recording Tips */}
      <Card className="bg-blue-900/20 border border-blue-700">
        <h3 className="font-semibold text-blue-300 mb-3">Recording Tips</h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>• Keep your phone at a safe distance but within recording range</li>
          <li>• Clearly state the date, time, and location at the beginning</li>
          <li>• Remain calm and follow your rights scripts</li>
          <li>• Do not interfere with police activities while recording</li>
          <li>• Save and share the recording immediately after the incident</li>
        </ul>
      </Card>

      {/* Saved Recordings */}
      {recordings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Saved Recordings</h2>
          <div className="space-y-4">
            {recordings.map((recording) => (
              <Card key={recording.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-white text-sm">
                        {new Date(recording.timestamp).toLocaleString()}
                      </span>
                      <span className="text-gray-400 text-sm">
                        ({formatTime(recording.duration)})
                      </span>
                    </div>
                    {recording.notes && (
                      <p className="text-gray-300 text-sm">{recording.notes}</p>
                    )}
                    {recording.location && (
                      <p className="text-gray-500 text-xs mt-1">
                        Location: {recording.location.lat.toFixed(4)}, {recording.location.lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadRecording(recording)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => shareRecording(recording)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <audio controls className="w-full mt-3">
                  <source src={recording.audioUrl} type="audio/webm" />
                  Your browser does not support the audio element.
                </audio>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Recording