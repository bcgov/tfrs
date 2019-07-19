package listeners

import org.spockframework.runtime.extension.IGlobalExtension
import org.spockframework.runtime.model.SpecInfo

class BrowserStackGlobalExtension implements IGlobalExtension {

  @Override
  void start() {}

  @Override
  void stop() {}

  @Override
  void visitSpec(SpecInfo spec) {
    if (BrowserStackReportingSpec.isAssignableFrom(spec.reflection)) {
      spec.addListener(new BrowserStackUpdateListener())
    }
  }
}
