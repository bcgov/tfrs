package listeners

import org.spockframework.runtime.AbstractRunListener
import org.spockframework.runtime.model.SpecInfo
import org.spockframework.runtime.model.FeatureInfo
import org.spockframework.runtime.model.ErrorInfo

class BrowserStackUpdateListener extends AbstractRunListener {

  boolean failed = false
  String reason = null

  @Override
  public void beforeSpec(SpecInfo spec) {
  }

  @Override
  public void beforeFeature(FeatureInfo feature) {
  }

  @Override
  public void afterFeature(FeatureInfo feature) {
    String id = SessionIdHolder.instance.sessionId.get()
    if (id != null) {
      BrowserStackAPI.updateSessionName(id, feature.featureMethod.name)
      if (this.failed) {
        BrowserStackAPI.markSessionFailed(id, reason)
      }
    }
  }

  @Override
  public void afterSpec(SpecInfo spec) {
  }

  @Override
  public void error(ErrorInfo error) {
    this.failed = true
    this.reason = error.exception.message
  }

}
